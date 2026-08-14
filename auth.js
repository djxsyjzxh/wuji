(function (global) {
  "use strict";

  var client = null;
  var initialized = false;

  function result(ok, data, error, status) {
    return {
      ok: !!ok,
      data: data || {},
      error: error || null,
      status: status || (ok ? 200 : 400)
    };
  }

  function getClient() {
    if (client) return client;
    if (!global.supabase || !global.supabase.createClient) return null;
    if (!global.WUJI_SUPABASE_URL || !global.WUJI_SUPABASE_ANON) return null;
    client = global.supabase.createClient(
      global.WUJI_SUPABASE_URL,
      global.WUJI_SUPABASE_ANON,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
    return client;
  }

  function init(onChange) {
    var supabaseClient = getClient();
    if (!supabaseClient) {
      if (onChange) onChange(null, "CLIENT_UNAVAILABLE");
      return Promise.resolve(null);
    }
    if (!initialized) {
      initialized = true;
      supabaseClient.auth.onAuthStateChange(function (event, session) {
        if (onChange) {
          // Do not call another Supabase method directly inside this callback.
          setTimeout(function () {
            onChange(session || null, event);
          }, 0);
        }
      });
    }
    return supabaseClient.auth.getSession().then(function (response) {
      var session = response && response.data ? response.data.session : null;
      if (onChange) onChange(session || null, "INITIAL_SESSION");
      return session || null;
    });
  }

  function signUp(email, password, nickname) {
    var supabaseClient = getClient();
    if (!supabaseClient) {
      return Promise.resolve(result(false, {}, new Error("Supabase client unavailable"), 0));
    }
    return supabaseClient.auth
      .signUp({
        email: email,
        password: password,
        options: {
          data: { nickname: nickname || "物友" },
          emailRedirectTo: global.location.origin + global.location.pathname
        }
      })
      .then(function (response) {
        var data = response.data || {};
        return result(!response.error, data, response.error, response.error ? 400 : 200);
      });
  }

  function signIn(email, password) {
    var supabaseClient = getClient();
    if (!supabaseClient) {
      return Promise.resolve(result(false, {}, new Error("Supabase client unavailable"), 0));
    }
    return supabaseClient.auth
      .signInWithPassword({ email: email, password: password })
      .then(function (response) {
        var data = response.data || {};
        return result(!response.error, data, response.error, response.error ? 400 : 200);
      });
  }

  function resetPassword(email) {
    var supabaseClient = getClient();
    if (!supabaseClient) {
      return Promise.resolve(result(false, {}, new Error("Supabase client unavailable"), 0));
    }
    return supabaseClient.auth
      .resetPasswordForEmail(email, {
        redirectTo: global.location.origin + global.location.pathname + "#/profile"
      })
      .then(function (response) {
        return result(!response.error, response.data || {}, response.error, response.error ? 400 : 200);
      });
  }

  function signOut() {
    var supabaseClient = getClient();
    if (!supabaseClient) return Promise.resolve(result(true));
    return supabaseClient.auth.signOut().then(function (response) {
      return result(!response.error, response.data || {}, response.error, response.error ? 400 : 200);
    });
  }

  global.WujiAuth = {
    init: init,
    signUp: signUp,
    signIn: signIn,
    resetPassword: resetPassword,
    signOut: signOut,
    getClient: getClient
  };
})(window);
