import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function Levantamento() {
  const router = useRouter();
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState("IBAN");
  const [referencia, setReferencia] = useState("");
  const [pin, setPin] = useState("");

  const handleLevantamento = () => {
    if (!valor || !referencia || !pin) {
      Alert.alert("Erro", "Por favor preencha todos os campos!");
      return;
    }
    Alert.alert(
      "Sucesso",
      `Levantamento de ${valor} KZ por ${metodo} efetuado com sucesso!`
    );
    setValor("");
    setReferencia("");
    setPin("");
  };

  const metodos = [
    { id: "IBAN", icon: "card-outline", label: "IBAN" },
    { id: "Telefone", icon: "call-outline", label: "Telefone" },
    { id: "Conta", icon: "wallet-outline", label: "Nº de Conta" },
  ];

  return (
    <LinearGradient
      colors={["#051937", "#00224E", "#003366"]}
      style={styles.container}
    >
      {/* Cabeçalho fixo */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#00BFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Levantamento</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saldo atual */}
        <LinearGradient
          colors={["#007BFF", "#00BFFF"]}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <Text style={styles.balanceValue}>245.000 KZ</Text>
          <Text style={styles.balanceSub}>Atualizado há 2 horas</Text>
        </LinearGradient>

        {/* Métodos */}
        <Text style={styles.sectionTitle}>Escolha o método de levantamento</Text>
        <View style={styles.methodRow}>
          {metodos.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.methodButton,
                metodo === m.id && styles.methodButtonActive,
              ]}
              onPress={() => setMetodo(m.id)}
            >
              <Ionicons
                name={m.icon}
                size={24}
                color={metodo === m.id ? "#00BFFF" : "#fff"}
              />
              <Text
                style={[
                  styles.methodText,
                  metodo === m.id && { color: "#00BFFF", fontWeight: "bold" },
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campos */}
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={22} color="#00BFFF" />
          <TextInput
            style={styles.input}
            placeholder="Valor a levantar (KZ)"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons
            name={
              metodo === "IBAN"
                ? "card-outline"
                : metodo === "Telefone"
                ? "call-outline"
                : "wallet-outline"
            }
            size={22}
            color="#00BFFF"
          />
          <TextInput
            style={styles.input}
            placeholder={
              metodo === "IBAN"
                ? "Digite o IBAN completo"
                : metodo === "Telefone"
                ? "Digite o número de telefone"
                : "Digite o número da conta"
            }
            placeholderTextColor="#aaa"
            keyboardType={metodo === "Telefone" ? "phone-pad" : "default"}
            value={referencia}
            onChangeText={setReferencia}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={22} color="#00BFFF" />
          <TextInput
            style={styles.input}
            placeholder="PIN de segurança"
            placeholderTextColor="#aaa"
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
            value={pin}
            onChangeText={setPin}
          />
        </View>

        {/* Botão */}
        <TouchableOpacity style={styles.button} onPress={handleLevantamento}>
          <LinearGradient
            colors={["#007BFF", "#00BFFF"]}
            style={styles.buttonGradient}
          >
            <Ionicons name="wallet-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Confirmar Levantamento</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Histórico */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Histórico de Levantamentos</Text>

          <View style={styles.historyCard}>
            <Ionicons name="cash-outline" size={22} color="#00BFFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.historyText}>20.000 KZ</Text>
              <Text style={styles.historySub}>IBAN - 23/10/2025</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color="#00D26A" />
          </View>

          <View style={styles.historyCard}>
            <Ionicons name="cash-outline" size={22} color="#00BFFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.historyText}>15.000 KZ</Text>
              <Text style={styles.historySub}>Telefone - 19/10/2025</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color="#00D26A" />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#021024",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#0A2A4C",
  },
  backButton: {
    backgroundColor: "#0A1E33",
    padding: 10,
    borderRadius: 12,
  },
  headerTitle: { color: "#00BFFF", fontSize: 20, fontWeight: "bold" },
  scrollContent: {
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#00BFFF",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  balanceLabel: { color: "#fff", opacity: 0.9, fontSize: 14 },
  balanceValue: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 6,
  },
  balanceSub: { color: "#E0E0E0", fontSize: 13, marginTop: 4 },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  methodButton: {
    backgroundColor: "#0A1E33",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  methodButtonActive: {
    borderColor: "#00BFFF",
    borderWidth: 2,
  },
  methodText: { color: "#fff", marginTop: 6, fontSize: 13, fontWeight: "500" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A1E33",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  historySection: { marginTop: 35 },
  historyTitle: {
    color: "#00BFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A1E33",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  historyText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  historySub: { color: "#aaa", fontSize: 12 },
});
