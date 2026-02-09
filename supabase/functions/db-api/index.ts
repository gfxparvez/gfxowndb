import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const body = await req.json();
    const { api_key, action, table, data, filters, row_id } = body;

    if (!api_key || !action || !table) {
      return new Response(JSON.stringify({ error: "Missing required fields: api_key, action, table" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Validate API key
    const { data: keyData, error: keyError } = await supabaseAdmin
      .from("api_keys")
      .select("id, database_id, user_id, is_active")
      .eq("key_value", api_key)
      .maybeSingle();

    if (keyError || !keyData || !keyData.is_active) {
      return new Response(JSON.stringify({ error: "Invalid or inactive API key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find the table
    const { data: tableData, error: tableError } = await supabaseAdmin
      .from("database_tables")
      .select("id")
      .eq("database_id", keyData.database_id)
      .eq("name", table)
      .maybeSingle();

    if (tableError || !tableData) {
      return new Response(JSON.stringify({ error: `Table "${table}" not found` }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result: any = null;
    let statusCode = 200;

    switch (action) {
      case "select": {
        let query = supabaseAdmin
          .from("table_rows")
          .select("id, data, created_at, updated_at")
          .eq("table_id", tableData.id);
        
        // Basic filtering on JSONB data fields
        if (filters && typeof filters === "object") {
          for (const [key, value] of Object.entries(filters)) {
            query = query.filter("data->>'" + key + "'", "eq", String(value));
          }
        }
        
        const { data: rows, error } = await query.order("created_at").limit(100);
        if (error) throw error;
        result = rows?.map((r: any) => ({ id: r.id, ...r.data, _created_at: r.created_at, _updated_at: r.updated_at }));
        break;
      }

      case "insert": {
        if (!data || typeof data !== "object") {
          return new Response(JSON.stringify({ error: "Missing 'data' object for insert" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data: inserted, error } = await supabaseAdmin
          .from("table_rows")
          .insert({ table_id: tableData.id, data })
          .select()
          .single();
        if (error) throw error;
        result = { id: inserted.id, ...inserted.data as object };
        statusCode = 201;
        break;
      }

      case "update": {
        if (!row_id || !data) {
          return new Response(JSON.stringify({ error: "Missing 'row_id' and 'data' for update" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        // Merge with existing data
        const { data: existing } = await supabaseAdmin
          .from("table_rows")
          .select("data")
          .eq("id", row_id)
          .eq("table_id", tableData.id)
          .maybeSingle();
        
        if (!existing) {
          return new Response(JSON.stringify({ error: "Row not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const mergedData = { ...(existing.data as object), ...data };
        const { data: updated, error } = await supabaseAdmin
          .from("table_rows")
          .update({ data: mergedData })
          .eq("id", row_id)
          .select()
          .single();
        if (error) throw error;
        result = { id: updated.id, ...updated.data as object };
        break;
      }

      case "delete": {
        if (!row_id) {
          return new Response(JSON.stringify({ error: "Missing 'row_id' for delete" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { error } = await supabaseAdmin
          .from("table_rows")
          .delete()
          .eq("id", row_id)
          .eq("table_id", tableData.id);
        if (error) throw error;
        result = { deleted: true };
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action "${action}". Use: select, insert, update, delete` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const responseTime = Date.now() - startTime;

    // Log the query
    await supabaseAdmin.from("query_logs").insert({
      database_id: keyData.database_id,
      user_id: keyData.user_id,
      method: action,
      endpoint: `/${table}`,
      status_code: statusCode,
      request_body: { action, table, filters: filters || null },
      response_time_ms: responseTime,
    });

    // Update last_used_at
    await supabaseAdmin.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyData.id);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("db-api error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
