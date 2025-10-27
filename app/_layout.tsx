import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Define o sistema de navegação */}
      <Stack
        screenOptions={{
          headerShown: false, // esconde cabeçalho padrão
          contentStyle: { backgroundColor: "#fff" },
          animation: "fade", // transição suave entre páginas
        }}
      />

      {/* StatusBar personalizada */}
      <StatusBar style="dark" backgroundColor="#fff" />
    </View>
  );
}
