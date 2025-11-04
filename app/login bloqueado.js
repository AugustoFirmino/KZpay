import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  // 👥 Mockup de 5 usuários fictícios
  const mockUsuarios = [
    { email: "cliente1@kzpay.com", senha: "12345", nome: "Carlos André" },
    { email: "cliente2@kzpay.com", senha: "senha2025", nome: "Maria Lopes" },
    { email: "admin@kzpay.com", senha: "admin123", nome: "Administrador" },
    { email: "gestor@kzpay.com", senha: "gestor001", nome: "Gestor Financeiro" },
    { email: "tecnico@kzpay.com", senha: "tec#2025", nome: "Técnico de Suporte" },
  ];

  // 🔒 Carrega status de bloqueio
  useEffect(() => {
    (async () => {
      const lock = await AsyncStorage.getItem("kzpay_bloqueado");
      if (lock === "true") setBloqueado(true);
    })();
  }, []);

  const handleLogin = async () => {
    if (bloqueado) {
      Alert.alert(
        "App Bloqueado",
        "A sua conta KZPay foi bloqueada. Reinstale o aplicativo para continuar."
      );
      return;
    }

    if (!email || !senha) {
      Alert.alert("Campos obrigatórios", "Preencha o email e a senha!");
      return;
    }

    try {
      setCarregando(true);
      await new Promise((r) => setTimeout(r, 600)); // simula atraso de rede

      // 🔍 Verifica usuário mock
      const user = mockUsuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
      );

      if (user) {
        await AsyncStorage.removeItem("TENTATIVAS_LOGIN");
        Alert.alert("Bem-vindo", `${user.nome}!`);
        setTentativas(0);
        router.push("/home");
      } else {
        const novasTentativas = tentativas + 1;
        setTentativas(novasTentativas);

        if (novasTentativas >= 3) {
          await AsyncStorage.setItem("kzpay_bloqueado", "true");
          setBloqueado(true);
          Alert.alert(
            "Bloqueado",
            "Você excedeu o limite de tentativas. Reinstale o app para continuar."
          );
        } else {
          Alert.alert(
            "Erro",
            `Credenciais inválidas (${novasTentativas}/3 tentativas).`
          );
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao processar o login.");
    } finally {
      setCarregando(false);
    }
  };

  // 🔒 Tela de bloqueio permanente
  if (bloqueado) {
    return (
      <LinearGradient
        colors={["#1e3a8a", "#1e6091", "#38a3a5"]}
        style={styles.lockContainer}
      >
        <Ionicons name="lock-closed" size={90} color="#fff" />
        <Text style={styles.lockTitle}>Aplicativo Bloqueado</Text>
        <Text style={styles.lockMessage}>
          Por motivos de segurança, este dispositivo foi bloqueado após várias
          tentativas falhas.{"\n\n"}Desinstale e reinstale o KZPay para voltar
          a usar.
        </Text>
      </LinearGradient>
    );
  }

  // 💳 Tela de login
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
        <Text style={styles.subTitle}>Gestão e Pagamentos Digitais</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#1e6091" />
          <TextInput
            style={styles.input}
            placeholder="exemplo@email.com"
            placeholderTextColor="#a1a1a1"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#1e6091" />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#a1a1a1"
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Ionicons
              name={mostrarSenha ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#1e6091"
            />
          </TouchableOpacity>
        </View>

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
          © 2025 KZPay - Todos os direitos reservados
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
});
