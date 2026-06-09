module.exports=[85152,(a,b,c)=>{b.exports=a.x("@prisma/client-536ea3aad1dc2a2a",()=>require("@prisma/client-536ea3aad1dc2a2a"))},50215,a=>a.a(async(b,c)=>{try{let b=await a.y("pg-018510bf026c4aba");a.n(b),c()}catch(a){c(a)}},!0),56749,a=>a.a(async(b,c)=>{try{var d=a.i(75522),e=a.i(3816),f=b([e]);[e]=f.then?(await f)():f;let h={theme:"dark",colors:{bg:"#1F080F",accent:"#D4AF37",text_primary:"#FFFFFF",text_secondary:"#A0A0A0",border:"rgba(255, 255, 255, 0.1)"},fonts:{title_family:"Outfit",body_family:"Plus Jakarta Sans",title_weight:"700",body_weight:"300"},effects:{border_width:"1px",backdrop_blur:"12px"}};async function g({children:a}){let b=h;try{let a=await e.prisma.siteSettings.findUnique({where:{config_key:"design_system"}});a&&(b=a.config_value)}catch(a){console.error("Erro ao carregar design system do banco, usando fallback:",a)}let c=b.fonts.title_family||"Outfit",f=b.fonts.body_family||"Plus Jakarta Sans",i=c.replace(/ /g,"+"),j=f.replace(/ /g,"+"),k=`https://fonts.googleapis.com/css2?family=${i}:wght@400;600;700;800&family=${j}:wght@200;300;400;500&display=swap`;return(0,d.jsxs)("html",{lang:"pt-BR",children:[(0,d.jsxs)("head",{children:[(0,d.jsx)("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),(0,d.jsx)("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),(0,d.jsx)("link",{rel:"stylesheet",href:k}),(0,d.jsx)("style",{dangerouslySetInnerHTML:{__html:`
          :root {
            --color-bg: ${b.colors.bg};
            --color-accent: ${b.colors.accent};
            --color-text-primary: ${b.colors.text_primary};
            --color-text-secondary: ${b.colors.text_secondary};
            --color-border: ${b.colors.border};
            --font-title: "${c}", sans-serif;
            --font-body: "${f}", sans-serif;
            --font-title-weight: ${b.fonts.title_weight||"700"};
            --font-body-weight: ${b.fonts.body_weight||"300"};
            --backdrop-blur: ${b.effects.backdrop_blur||"12px"};
            --border-width: ${b.effects.border_width||"1px"};
          }
        `}})]}),(0,d.jsx)("body",{children:a})]})}a.s(["default",0,g,"metadata",0,{title:"AVA Vitória — Streetwear de Luxo",description:"Marca conceitual de streetwear inspirada na cultura urbana de Vitória."}]),c()}catch(a){c(a)}},!1),6561,a=>{a.n(a.i(56749))}];

//# sourceMappingURL=%5Broot-of-the-server%5D__1rg6_-q._.js.map