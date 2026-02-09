import { Text } from "@react-navigation/elements";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface SignupFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  showPassword: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FieldTouched {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export function Signup() {
  const [formState, setFormState] = useState<SignupFormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isLoading: false,
    showPassword: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<FieldTouched>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const { signup } = useAuth();
  const { navigate } = useNavigation();

  const updateFormField = (
    field: keyof SignupFormState,
    value: string | boolean,
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const markFieldAsTouched = (field: keyof FieldTouched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (
    field: keyof ValidationErrors,
    value: string,
  ): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) {
          return "Name is required";
        }
        if (value.trim().length < 2) {
          return "Name must be at least 2 characters";
        }
        return undefined;

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Email address is incomplete";
        }
        return undefined;

      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return undefined;

      case "confirmPassword":
        if (!value) {
          return "Please confirm your password";
        }
        if (value !== formState.password) {
          return "Passwords do not match";
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof ValidationErrors) => {
    markFieldAsTouched(field);
    const value = formState[field] as string;
    const error = validateField(field, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    (Object.keys(formState) as Array<keyof ValidationErrors>).forEach(
      (field) => {
        if (
          field === "name" ||
          field === "email" ||
          field === "password" ||
          field === "confirmPassword"
        ) {
          const error = validateField(field, formState[field] as string);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        }
      },
    );

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  };

  const handleSignup = async () => {
    const { name, email, password } = formState;

    // Validate all fields
    if (!validateAllFields()) {
      return;
    }

    updateFormField("isLoading", true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error instanceof Error ? error.message : "An error occurred",
      );
    } finally {
      updateFormField("isLoading", false);
    }
  };

  const { name, email, password, confirmPassword, isLoading, showPassword } =
    formState;

  // Determine password match status
  const getPasswordMatchStatus = () => {
    if (!confirmPassword) return null; // Don't show indicator if field is empty
    if (password === confirmPassword) return "match";
    return "mismatch";
  };

  const passwordMatchStatus = getPasswordMatchStatus();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[
                styles.input,
                touched.name && errors.name && styles.inputError,
              ]}
              placeholder="Enter your name"
              value={name}
              onChangeText={(value) => updateFormField("name", value)}
              onBlur={() => handleBlur("name")}
              autoCapitalize="words"
              editable={!isLoading}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                touched.email && errors.email && styles.inputError,
              ]}
              placeholder="Enter your email"
              value={email}
              onChangeText={(value) => updateFormField("email", value)}
              onBlur={() => handleBlur("email")}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordContainer,
                touched.password && errors.password && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChangeText={(value) => {
                  updateFormField("password", value);
                  // Real-time validation for password as user types
                  if (value.length > 0 && value.length < 6) {
                    setErrors((prev) => ({
                      ...prev,
                      password: "Password must be at least 6 characters",
                    }));
                  } else if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                  // Re-validate confirm password if it's been touched
                  if (touched.confirmPassword && confirmPassword) {
                    const confirmError =
                      value !== confirmPassword
                        ? "Passwords do not match"
                        : undefined;
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: confirmError,
                    }));
                  }
                }}
                onBlur={() => handleBlur("password")}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => updateFormField("showPassword", !showPassword)}
              >
                <AntDesign
                  name={showPassword ? "eye" : "eye-invisible"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={[
                styles.confirmPasswordContainer,
                passwordMatchStatus === "match" && styles.matchBorder,
                passwordMatchStatus === "mismatch" && styles.mismatchBorder,
                touched.confirmPassword &&
                  errors.confirmPassword &&
                  !passwordMatchStatus &&
                  styles.inputError,
              ]}
            >
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(value) => {
                  updateFormField("confirmPassword", value);
                  // Real-time validation as user types
                  if (value && value !== password) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: "Passwords do not match",
                    }));
                  } else if (errors.confirmPassword) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }
                }}
                onBlur={() => handleBlur("confirmPassword")}
                secureTextEntry
                editable={!isLoading}
              />
              {passwordMatchStatus && (
                <View style={styles.matchIndicator}>
                  {passwordMatchStatus === "match" ? (
                    <AntDesign name="check-circle" size={20} color="#34C759" />
                  ) : (
                    <AntDesign name="close-circle" size={20} color="#FF3B30" />
                  )}
                </View>
              )}
            </View>
            {passwordMatchStatus === "match" && !errors.confirmPassword && (
              <Text style={styles.matchText}>Passwords match</Text>
            )}
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <TouchableOpacity onPress={handleSignup} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigate("Login")}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#E53935",
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: "#E53935",
    marginTop: 4,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  confirmPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  matchBorder: {
    borderColor: "#34C759",
    borderWidth: 2,
  },
  mismatchBorder: {
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  matchIndicator: {
    padding: 12,
  },
  matchText: {
    fontSize: 12,
    color: "#34C759",
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginTop: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
