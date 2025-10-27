import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const transactions = [
  { id: "1", title: "Compra no Shoprite", amount: "-8,500 KZ", icon: "cart-outline" },
  { id: "2", title: "Transferência recebida", amount: "+15,000 KZ", icon: "cash-outline" },
  { id: "3", title: "Pagamento de Internet", amount: "-12,000 KZ", icon: "wifi-outline" },
  { id: "4", title: "Recarga de saldo", amount: "+5,000 KZ", icon: "phone-portrait-outline" },
  { id: "5", title: "Compra no Kero", amount: "-9,200 KZ", icon: "basket-outline" },
  { id: "6", title: "Depósito recebido", amount: "+20,000 KZ", icon: "download-outline" },
  { id: "7", title: "Compra online (Amazon)", amount: "-17,800 KZ", icon: "globe-outline" },
  { id: "8", title: "Pagamento TV Cabo", amount: "-6,000 KZ", icon: "tv-outline" },
  { id: "9", title: "Reembolso recebido", amount: "+2,500 KZ", icon: "arrow-down-circle-outline" },
  { id: "10", title: "Serviço de transporte", amount: "-3,000 KZ", icon: "car-outline" },
  { id: "11", title: "Transferência enviada", amount: "-10,000 KZ", icon: "arrow-up-circle-outline" },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bem-vindo(a) 👋</Text>
          <Text style={styles.username}>João</Text>
        </View>
        <TouchableOpacity>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/194/194938.png" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Cartão de saldo */}
      <LinearGradient colors={["#FFB100", "#FF9500"]} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo disponível</Text>
        <Text style={styles.balanceValue}>45,250 KZ</Text>
        <Text style={styles.balanceSub}>Atualizado há 2 horas</Text>
      </LinearGradient>

      {/* Ações principais */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="send" size={28} color="#fff" />
          <Text style={styles.actionText}>Transferir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="qr-code" size={28} color="#fff" />
          <Text style={styles.actionText}>Pagar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cart" size={28} color="#fff" />
          <Text style={styles.actionText}>Comprar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="wallet" size={28} color="#fff" />
          <Text style={styles.actionText}>Levantar</Text>
        </TouchableOpacity>
      </View>

      {/* Histórico de transações */}
      <Text style={styles.historyTitle}>Últimas transações</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.amount.startsWith("+") ? "#4CAF50" : "#FF5252"}
                />
              </View>
              <Text style={styles.transactionTitle}>{item.title}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: item.amount.startsWith("+") ? "#4CAF50" : "#FF5252" },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcome: {
    color: "#ccc",
    fontSize: 15,
  },
  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#FFB100",
  },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  balanceLabel: {
    color: "#fff",
    opacity: 0.8,
    fontSize: 14,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 6,
  },
  balanceSub: {
    color: "#fff",
    opacity: 0.7,
    fontSize: 13,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  actionButton: {
    backgroundColor: "#1E2329",
    width: "23%",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  historyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  transactionItem: {
    backgroundColor: "#1E2329",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#222831",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionTitle: {
    color: "#ddd",
    fontSize: 15,
  },
  transactionAmount: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
