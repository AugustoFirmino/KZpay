import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function LevantamentoPremium() {
  const router = useRouter();
  const flatListRef = useRef(null);

  const [cards, setCards] = useState([
    { id: "1", banco: "KZPAY", numero: "0001 0495 3948 ****", cor: ["#8F80FF", "#4C44C1"], saldo: 4450000000 },
    { id: "2", banco: "Banco B", numero: "5678 0593 1294 ****", cor: ["#FF6B6B", "#C44C4C"], saldo: 2300000 },
    { id: "3", banco: "Banco C", numero: "9012 0493 9459 ****", cor: ["#4CC1A1", "#2A8F7B"], saldo: 7800000 },
  ]);

  const [selectedCardId, setSelectedCardId] = useState(cards[0].id);
  const [saldo, setSaldo] = useState(cards[0].saldo);

  const [valor, setValor] = useState("");
  const [pin, setPin] = useState("");
  const [history, setHistory] = useState([]);
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Atualiza saldo quando seleciona outro cartão
  useEffect(() => {
    const selectedCard = cards.find(c => c.id === selectedCardId);
    if (selectedCard) setSaldo(selectedCard.saldo);
  }, [selectedCardId]);

  const handleSelectCard = (item, index) => {
    setSelectedCardId(item.id);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleLevantamento = () => {
    if (!valor || !pin) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    const valorNum = Number(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      Alert.alert("Erro", "Valor inválido!");
      return;
    }
    if (valorNum > saldo) {
      Alert.alert("Saldo insuficiente", "Não tens saldo suficiente.");
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      Alert.alert("Erro", "Palavra-passe do aplicativo deve ter 6 dígitos!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const kzpayCode = `KZPAY-${Math.floor(100000 + Math.random() * 900000)}`;
      const id = `${Date.now()}`;
      const newItem = {
        id,
        valor: valorNum,
        valorStr: formatCurrency(valorNum),
        kzpayCode,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        cardId: selectedCardId,
      };

      setHistory(h => [newItem, ...h]);

      setCards(prev =>
        prev.map(c =>
          c.id === selectedCardId ? { ...c, saldo: c.saldo - valorNum } : c
        )
      );

      setSaldo(s => s - valorNum);
      setValor("");
      setPin("");
      setLoading(false);
      setSuccessModalVisible(true);

      setTimeout(() => setSuccessModalVisible(false), 30000);
    }, 2000);
  };

  function formatCurrency(v) {
    let n = typeof v === "number" ? v : Number(String(v).replace(/\D/g, ""));
    if (isNaN(n)) n = 0;
    return new Intl.NumberFormat("pt-PT").format(n) + " KZ";
  }

  const renderCard = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleSelectCard(item, index)}
      style={[
        styles.cardItem,
        {
          borderWidth: selectedCardId === item.id ? 2 : 0,
          borderColor: selectedCardId === item.id ? "#4C44C1" : "transparent",
        },
      ]}
      activeOpacity={0.9}
    >
      <LinearGradient colors={item.cor} style={styles.cardGradient}>
        <Text style={styles.cardBank}>{item.banco}</Text>
        <Text style={styles.cardNumber}>{item.numero}</Text>
        {selectedCardId === item.id && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color="#FFD700"
            style={{ position: "absolute", top: 8, right: 8 }}
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Levantamento</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Saldo */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet-outline" size={24} color="#4C44C1" />
            <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          </View>
          <Text style={styles.balanceValue}>{formatCurrency(saldo)}</Text>
          <Text style={styles.balanceHint}>Use este saldo para levantamentos imediatos</Text>
        </View>

        {/* Cartões */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Escolha o cartão</Text>
          <FlatList
            ref={flatListRef}
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 2 }}
            getItemLayout={(data, index) => ({ length: 212, offset: 212 * index, index })}
          />
        </View>

        {/* Inputs do levantamento */}
        <View
          style={[
            styles.inputContainer,
            focusedInput === "valor" && { borderColor: "#4C44C1" }
          ]}
        >
          <Ionicons name="cash-outline" size={20} color="#4C44C1" />
          <TextInput
            placeholder="Valor a levantar"
            placeholderTextColor="#9B9B9B"
            style={styles.input}
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
            onFocus={() => setFocusedInput("valor")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            focusedInput === "pin" && { borderColor: "#4C44C1" }
          ]}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#4C44C1" />
          <TextInput
            placeholder="Palavra-passe do aplicativo (6 dígitos)"
            placeholderTextColor="#9B9B9B"
            style={styles.input}
            keyboardType="numeric"
            secureTextEntry
            value={pin}
            onChangeText={setPin}
            maxLength={6}
            onFocus={() => setFocusedInput("pin")}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLevantamento}
          activeOpacity={0.8}
          disabled={loading}
        >
          <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.buttonGradient}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="arrow-up-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Levantar</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Histórico de levantamentos */}
        {history.length > 0 && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.sectionTitle}>Histórico de Levantamentos</Text>
            {history.map(item => (
              <View key={item.id} style={styles.historyItem}>
                <Text style={{ fontWeight: "700" }}>{item.valorStr}</Text>
                <Text style={{ fontSize: 12, color: "#7A7A7A" }}>{item.kzpayCode}</Text>
                <Text style={{ fontSize: 12, color: "#7A7A7A" }}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal de sucesso */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle-outline" size={60} color="#44c144ff" />
            <Text style={styles.modalText}>Dinheiro levantado com sucesso</Text>
            <TouchableOpacity
              onPress={() => setSuccessModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 10,
    backgroundColor: "#8F80FF",
    borderBottomWidth: 1,
    borderBottomColor: "#E6E6E6"
  },
  backButton: { padding: 8, borderRadius: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingHorizontal: 18, paddingBottom: 40 },

  balanceCard: { borderRadius: 24, padding: 25, marginBottom: 25, backgroundColor: "#F9F9F9" },
  balanceHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  balanceLabel: { color: "#4C44C1", fontWeight: "600", fontSize: 16, marginLeft: 8 },
  balanceValue: { color: "#000", fontWeight: "bold", fontSize: 32, marginTop: 6 },
  balanceHint: { color: "#7A7A7A", fontSize: 13, marginTop: 4 },

  sectionTitle: { color: "#4C44C1", fontWeight: "700", marginBottom: 8 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "transparent"
  },
  input: { flex: 1, color: "#000", marginLeft: 10, fontSize: 15 },

  button: { marginTop: 12, borderRadius: 12, overflow: "hidden" },
  buttonGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12 },
  buttonText: { color: "#fff", fontWeight: "700", marginLeft: 8 },

  cardItem: { width: 200, height: 110, borderRadius: 16, marginRight: 12 },
  cardGradient: { flex: 1, borderRadius: 16, padding: 14, justifyContent: "space-between" },
  cardBank: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cardNumber: { color: "#fff", fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", padding: 24, borderRadius: 16, alignItems: "center", width: "80%" },
  modalText: { fontSize: 18, fontWeight: "700", color: "#4C44C1", marginTop: 12, textAlign: "center" },
  modalButton: { marginTop: 20, backgroundColor: "#4C44C1", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  modalButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  historyItem: {
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  }
});
