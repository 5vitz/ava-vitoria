module.exports = [
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/Documentos/Antigravity/Ava-Vitoria/src/app/api/auth/[...nextauth]/route.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>handler,
    "POST",
    ()=>handler,
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next-auth/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next-auth/providers/credentials.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$bcrypt$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs, [project]/Documentos/Antigravity/Ava-Vitoria/node_modules/bcrypt)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "admin"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                // Buscar usuário no banco PostgreSQL
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].user.findUnique({
                    where: {
                        username: credentials.username
                    }
                });
                if (!user) {
                    return null;
                }
                // Comparar senhas com bcrypt
                const isPasswordValid = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$bcrypt$29$__["default"].compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
                return {
                    id: user.id,
                    name: user.username,
                    email: `${user.username}@avavitoria.com.br` // Email placeholder exigido pelo tipo do User do NextAuth
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.name;
            }
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: "/admin/login",
        error: "/admin/login"
    },
    secret: process.env.NEXTAUTH_SECRET || "development-secret-key-123456"
};
const handler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"])(authOptions);
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/* __next_internal_action_entry_do_not_use__ [{"4042f24b643790e42c4c5cb748544ea79fc925a7b9":{"name":"saveDesignSystem"}},"Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/actions.ts",""] */ __turbopack_context__.s([
    "saveDesignSystem",
    ()=>saveDesignSystem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next-auth/next/index.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/src/app/api/auth/[...nextauth]/route.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/src/lib/db.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function saveDesignSystem(config) {
    // 1. Validar se o usuário está autenticado
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$api$2f$auth$2f5b2e2e2e$nextauth$5d2f$route$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session) {
        throw new Error("Não autorizado. Você precisa estar logado.");
    }
    // 2. Salvar as configurações no banco de dados PostgreSQL
    await __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].siteSettings.upsert({
        where: {
            config_key: "design_system"
        },
        update: {
            config_value: config,
            updated_at: new Date()
        },
        create: {
            config_key: "design_system",
            config_value: config
        }
    });
    // 3. Revalidar rotas afetadas para que as novas cores apareçam imediatamente
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/admin/design-system");
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    saveDesignSystem
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveDesignSystem, "4042f24b643790e42c4c5cb748544ea79fc925a7b9", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Documentos/Antigravity/Ava-Vitoria/.next-internal/server/app/admin/design-system/page/actions.js { ACTIONS_MODULE0 => \"[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Documentos/Antigravity/Ava-Vitoria/.next-internal/server/app/admin/design-system/page/actions.js { ACTIONS_MODULE0 => \"[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "4042f24b643790e42c4c5cb748544ea79fc925a7b9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveDesignSystem"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$design$2d$system$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Documentos/Antigravity/Ava-Vitoria/.next-internal/server/app/admin/design-system/page/actions.js { ACTIONS_MODULE0 => "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/design-system/actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$design$2d$system$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$design$2d$system$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$design$2d$system$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0fogsh3._.js.map