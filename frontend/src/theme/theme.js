import { createTheme } from "@mui/material/styles";

// Function to create modern themes with additional features
const createModernTheme = (
	mode,
	primaryMain,
	backgroundDefault,
	backgroundPaper,
	textPrimary
) =>
	createTheme({
		palette: {
			mode,
			primary: { main: primaryMain },
			background: { default: backgroundDefault, paper: backgroundPaper },
			text: { primary: textPrimary },
			divider: { primary: primaryMain },
		},
		typography: {
			fontFamily: "'Nunito', sans-serif",
			h1: { fontSize: "2.5rem", fontWeight: 700 },
			h2: { fontSize: "2rem", fontWeight: 600 },
			h3: { fontSize: "1.75rem", fontWeight: 500 },
			body1: { fontSize: "1rem" },
		},
		shape: {
			borderRadius: 4,
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						borderRadius: 4,
						textTransform: "none",
						fontWeight: 600,
					},
				},
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: 4,
						boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
					},
				},
			},
		},
	});

// Light Themes
const lightTheme1 = createModernTheme(
	"light",
	"#1976d2",
	"#f5f5f5",
	"#ffffff",
	"#333333"
);
const lightTheme2 = createModernTheme(
	"light",
	"#ff5722",
	"#fafafa",
	"#ffffff",
	"#444444"
);
const lightTheme3 = createModernTheme(
	"light",
	"#009688",
	"#e0f2f1",
	"#ffffff",
	"#222222"
);
const lightTheme4 = createModernTheme(
	"light",
	"#4caf50",
	"#f1f8e9",
	"#ffffff",
	"#555555"
);
const lightTheme5 = createModernTheme(
	"light",
	"#3f51b5",
	"#e8eaf6",
	"#ffffff",
	"#111111"
);
const lightTheme6 = createModernTheme(
	"light",
	"#795548",
	"#efebe9",
	"#ffffff",
	"#666666"
);
const lightTheme7 = createModernTheme(
	"light",
	"#ff9800",
	"#fff3e0",
	"#ffffff",
	"#000000"
);

// Dark Themes
const darkTheme1 = createModernTheme(
	"dark",
	"#90caf9",
	"#121212",
	"#1e1e1e",
	"#ffffff"
);
const darkTheme2 = createModernTheme(
	"dark",
	"#ff7043",
	"#1a1a1a",
	"#2e2e2e",
	"#eeeeee"
);
const darkTheme3 = createModernTheme(
	"dark",
	"#26a69a",
	"#121212",
	"#1e1e1e",
	"#dddddd"
);
const darkTheme4 = createModernTheme(
	"dark",
	"#66bb6a",
	"#1b1b1b",
	"#292929",
	"#cccccc"
);
const darkTheme5 = createModernTheme(
	"dark",
	"#7986cb",
	"#161616",
	"#252525",
	"#bbbbbb"
);
const darkTheme6 = createModernTheme(
	"dark",
	"#a1887f",
	"#1c1c1c",
	"#2f2f2f",
	"#aaaaaa"
);
const darkTheme7 = createModernTheme(
	"dark",
	"#ffa726",
	"#131313",
	"#242424",
	"#999999"
);

export const themes = {
	lightTheme1,
	lightTheme2,
	lightTheme3,
	lightTheme4,
	lightTheme5,
	lightTheme6,
	lightTheme7,
	darkTheme1,
	darkTheme2,
	darkTheme3,
	darkTheme4,
	darkTheme5,
	darkTheme6,
	darkTheme7,
};
