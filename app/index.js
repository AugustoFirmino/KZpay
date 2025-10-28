import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const drawerWidth = width * 0.75;

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
];

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [balance, setBalance] = useState(450000000);

  const toggleMenu = () => {
    const toValue = menuVisible ? -drawerWidth : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    if (menuVisible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(arrowAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      arrowAnim.stopAnimation();
    }
  }, [menuVisible]);

  const handleLogout = () => {
    Alert.alert("Confirmar saída", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: () => {
          setMenuVisible(false);
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  };

  const menuItems = [
    { icon: "home-outline", label: "Início", route: "/" },
    { icon: "card-outline", label: "Gestão de Contas", route: "/contas" },
    { icon: "stats-chart-outline", label: "Atividades", route: "/actividades" },
    { icon: "settings-outline", label: "Configurações", route: "/configuracoes" },
    { icon: "information-circle-outline", label: "Sobre o KZPay", route: "/sobre" },
    { icon: "log-out-outline", label: "Sair", route: "logout" },
  ];

  const actions = [
    { icon: "send", label: "Transferir", route: "/transferir" },
    { icon: "qr-code", label: "Pagar", route: "/pagar_levantamento" },
    { icon: "cart", label: "Comprar", route: "/comprar" },
    { icon: "wallet", label: "Levantar", route: "/levantar" },
    { icon: "cash", label: "Adiantamento", route: "/adiantamento" },
    { icon: "card", label: "Crédito", route: "/credito" },
  ];


  const formatBalance = (value) => {
    
  
 
    let n = typeof value === "number" ? value : Number(String(value).replace(/\D/g, ""));
    if (isNaN(n)) n = 0;
    return new Intl.NumberFormat("pt-PT").format(n) + " KZ";
  

  };

  const getBalanceFontSize = (text) => {
    const base = 36;
    const len = text.length;
    if (len <= 9) return base;
    const reduction = (len - 9) * 2;
    return Math.max(18, base - reduction);
  };

  const formattedBalance = formatBalance(balance);
  const balanceFontSize = getBalanceFontSize(formattedBalance);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0B14" />

      {/* MENU LATERAL */}
      {menuVisible && (
        <View style={styles.menuOverlay}>
          <Animated.View
            style={[
              styles.drawer,
              { width: drawerWidth, transform: [{ translateX: slideAnim }] },
            ]}
          >
            <LinearGradient colors={["#15141F", "#0B0A10"]} style={styles.drawerContent}>
              <View style={styles.drawerHeader}>
                <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                  <Ionicons name="close-outline" size={30} color="#fff" />
                </TouchableOpacity>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/194/194938.png" }}
                  style={styles.drawerAvatar}
                />
                <Text style={styles.drawerUsername}>Augusto Firmino</Text>
                <Text style={styles.drawerSubtitle}>Conta pessoal</Text>
              </View>

              <View style={styles.drawerMenu}>
                {menuItems.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.drawerItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (item.route === "logout") return handleLogout();
                      toggleMenu();
                      router.push(item.route);
                    }}
                  >
                    <Ionicons name={item.icon} size={24} color="#8F80FF" />
                    <Text style={styles.drawerItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* FUNDO ESCURO */}
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.overlayDark}>
              <Animated.View
                style={[
                  styles.arrowHint,
                  {
                    opacity: arrowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                    transform: [
                      {
                        translateX: arrowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons name="arrow-back-circle-outline" size={40} color="#fff" />
                <Text style={styles.arrowText}>Tocar para fechar</Text>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Ionicons name="menu-outline" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/194/194938.png" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>Augusto Firmino</Text>
              <Text style={styles.userSubtitle}>Conta pessoal • KZPay</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <LinearGradient colors={["#8F80FF", "#4C44C1", "#1F1C2C"]} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo disponível</Text>
          <Text style={[styles.balanceValue, { fontSize: balanceFontSize }]}>
            {formattedBalance}
          </Text>
          <Text style={styles.balanceSub}>Atualizado há 2 horas</Text>
        </LinearGradient>

        {/* AÇÕES COM NAVEGAÇÃO */}
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => router.push(action.route)}
            >
              <Ionicons name={action.icon} size={26} color="#A18CFF" />
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
                    color={item.amount.startsWith("+") ? "#4CAF50" : "#FF5C93"}
                  />
                </View>
                <Text style={styles.transactionTitle}>{item.title}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: item.amount.startsWith("+") ? "#4CAF50" : "#FF5C93" },
                ]}
              >
                {item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0D0B14" },
  container: { flex: 1, backgroundColor: "#0D0B14", paddingHorizontal: 20, paddingTop: 50 },
  menuOverlay: { position: "absolute", top: 0, left: 0, height, width: "100%", flexDirection: "row", zIndex: 100 },
  drawer: { height: "100%" },
  drawerContent: { flex: 1, paddingTop: 60, paddingHorizontal: 25 },
  overlayDark: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "center", alignItems: "center" },
  arrowHint: { alignItems: "center" },
  arrowText: { color: "#fff", fontSize: 13, marginTop: 6, opacity: 0.8 },
  closeButton: { position: "absolute", top: 15, right: 15 },
  drawerHeader: { alignItems: "center", marginBottom: 30 },
  drawerAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10, borderWidth: 2, borderColor: "#8F80FF" },
  drawerUsername: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  drawerSubtitle: { color: "#bbb", fontSize: 14 },
  drawerMenu: { marginTop: 20 },
  drawerItem: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomColor: "#222", borderBottomWidth: 1 },
  drawerItemText: { color: "#fff", fontSize: 16, marginLeft: 16, fontWeight: "500" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  menuButton: { marginRight: 8 },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 45, height: 45, borderRadius: 22, marginRight: 12, borderWidth: 2, borderColor: "#8F80FF" },
  username: { color: "#fff", fontSize: 18, fontWeight: "700" },
  userSubtitle: { color: "#bbb", fontSize: 13, marginTop: 2 },
  notificationButton: { backgroundColor: "#1E2230", padding: 10, borderRadius: 12 },
  balanceCard: { borderRadius: 20, padding: 25, marginBottom: 25 },
  balanceLabel: { color: "#fff", opacity: 0.8, fontSize: 14 },
  balanceValue: { color: "#fff", fontWeight: "bold", marginTop: 6 },
  balanceSub: { color: "#fff", opacity: 0.7, fontSize: 13, marginTop: 4 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 25 },
  actionButton: { backgroundColor: "#1A1830", width: "30%", marginVertical: 8, paddingVertical: 15, borderRadius: 16, alignItems: "center" },
  actionText: { color: "#fff", marginTop: 6, fontSize: 12, fontWeight: "600" },
  historyTitle: { color: "#fff", fontSize: 18, fontWeight: "600", marginBottom: 12 },
  transactionItem: { backgroundColor: "#171626", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderRadius: 12, marginBottom: 10 },
  transactionLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: { backgroundColor: "#22213A", width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", marginRight: 12 },
  transactionTitle: { color: "#ddd", fontSize: 15 },
  transactionAmount: { fontWeight: "bold", fontSize: 15 },
});
