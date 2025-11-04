import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [numero, setNumero] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const senhaRef = useRef(null);

  // Mock de usuários (teste)
  const mockUsuarios = [
    { numero: "90011122233344", senha: "123456", nome: "Carlos André" },
    { numero: "92345678900011", senha: "202525", nome: "Maria Lopes" },
    { numero: "90055544477788", senha: "111111", nome: "Administrador" },
  ];

  // Verifica bloqueio
  useEffect(() => {
    (async () => {
      const lock = await AsyncStorage.getItem("kzpay_bloqueado");
      if (lock === "true") setBloqueado(true);
    })();
  }, []);

  const handleLogin = async () => {
    if (bloqueado) {
      Alert.alert("Conta bloqueada", "Desbloqueie antes de continuar.");
      return;
    }

    if (!numero || !senha) {
      Alert.alert("Campos obrigatórios", "Preencha o número e a senha!");
      return;
    }

    setCarregando(true);
    await new Promise((r) => setTimeout(r, 700)); // simula rede

    const user = mockUsuarios.find(
      (u) => u.numero === numero && u.senha === senha
    );

    if (user) {
      await AsyncStorage.removeItem("kzpay_bloqueado");
      await AsyncStorage.removeItem("TENTATIVAS_LOGIN");
      Alert.alert("Bem-vindo(a)", `${user.nome}!`);
      router.push("/home");
    } else {
      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);
      if (novasTentativas >= 3) {
        await AsyncStorage.setItem("kzpay_bloqueado", "true");
        setBloqueado(true);
        Alert.alert(
          "Bloqueado",
          "Você excedeu o limite de tentativas. O app foi bloqueado."
        );
      } else {
        Alert.alert(
          "Erro",
          `Número ou senha incorretos (${novasTentativas}/3 tentativas)`
        );
      }
    }
    setCarregando(false);
  };

  // Função de desbloqueio (teste)
  const handleDesbloquear = async () => {
    await AsyncStorage.removeItem("kzpay_bloqueado");
    setBloqueado(false);
    setTentativas(0);
    Alert.alert("Desbloqueado", "O aplicativo foi desbloqueado com sucesso!");
  };

  // Se estiver bloqueado, mostra a tela de bloqueio
  if (bloqueado) {
    return (
      <LinearGradient
        colors={["#1e3a8a", "#1e6091", "#38a3a5"]}
        style={styles.lockContainer}
      >
        <Ionicons name="lock-closed" size={90} color="#fff" />
        <Text style={styles.lockTitle}>Aplicativo Bloqueado</Text>
        <Text style={styles.lockMessage}>
          Este dispositivo foi bloqueado por excesso de tentativas.
        </Text>

        <Text style={styles.lockMessage}>
         Powered by Luxon Technologies
        </Text>

        {/* Botão para desbloquear */}
        <TouchableOpacity style={styles.unlockButton} onPress={handleDesbloquear}>
          <Ionicons name="unlock-outline" size={22} color="#fff" />
          <Text style={styles.unlockText}>Desbloquear</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0a3d62", "#1e6091", "#1a759f"]}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/6269/6269947.png",
          }}
          style={styles.logo}
        />
        <Text style={styles.appName}>KZPay</Text>
        <Text style={styles.subTitle}>Pagamentos Digitais,simples, rápidos e seguros</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Número de Adesão / Telefone</Text>
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={20} color="#1e6091" />
          <TextInput
            style={styles.input}
            placeholder="Ex: 92345678900011"
            placeholderTextColor="#a1a1a1"
            keyboardType="numeric"
            maxLength={14}
            value={numero}
            onChangeText={setNumero}
          />
        </View>

        <Text style={styles.label}>Palavra-passe</Text>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.passwordDotsContainer}
          onPress={() => senhaRef.current?.focus()}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < senha.length && styles.dotFilled]}
            />
          ))}
        </TouchableOpacity>

        <TextInput
          ref={senhaRef}
          style={styles.hiddenInput}
          keyboardType="number-pad"
          maxLength={6}
          value={senha}
          onChangeText={setSenha}
          autoFocus={false}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/recuperar-senha")}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Powered by Luxon Technologies © 2025
        </Text>
      </View>
    </LinearGradient>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logo: { width: 90, height: 90, marginBottom: 10 },
  appName: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  subTitle: { color: "#e0e0e0", fontSize: 14, marginTop: 5 },
  form: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  label: { color: "#1e6091", marginTop: 10, fontWeight: "bold" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: "#f8f9fa",
  },
  input: { flex: 1, height: 45, marginLeft: 5, color: "#333" },
  passwordDotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#1e6091",
    backgroundColor: "transparent",
  },
  dotFilled: { backgroundColor: "#1e6091" },
  hiddenInput: {
    position: "absolute",
    height: 0,
    width: 0,
    opacity: 0,
  },
  button: {
    backgroundColor: "#1e6091",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: {
    color: "#1e6091",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  footer: { marginTop: 30 },
  footerText: { color: "#e0e0e0", fontSize: 12 },

  // 🔒 Tela de bloqueio
  lockContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  lockTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  lockMessage: {
    color: "#e0e0e0",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0b7285",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  unlockText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
