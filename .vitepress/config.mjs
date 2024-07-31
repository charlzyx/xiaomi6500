import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "小米路由器 BE6500 Pro",
	base: "/xiaomi6500",
	description: "路由器的折腾日记",
	appearance: "force-dark",
	themeConfig: {
		darkModeSwitchLabel: false,
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "破解", link: "https://www.gaicas.com/xiaomi-be6500-pro.html" },
			{ text: "ShellCrash", link: "/guide/shellcrash" },
			{ text: "tailscale", link: "/guide/tailscale" },
			{ text: "nginx", link: "/guide/nginx" },
		],
		sidebar: [],

		socialLinks: [
			{ icon: "github", link: "https://github.com/charlzyx/xiaomi6500" },
		],
	},
});
