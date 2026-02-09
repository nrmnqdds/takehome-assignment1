import { Text } from "@react-navigation/elements";
import { StyleSheet, View, Alert, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";

export function Settings() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          const result = await logout();
          if (!result.success && result.error) {
            Alert.alert("Logout Failed", result.error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Screen</Text>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Logged in as:</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      )}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userInfo: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 30,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
