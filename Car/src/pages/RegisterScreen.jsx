import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "@env";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(""); 
    const [gender, setGender] = useState(""); 
    const [address, setAddress] = useState(""); 
    const [driverLicense, setDriverLicense] = useState(""); 

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!username) newErrors.username = "Vui lòng nhập Email";
        else if (!/\S+@\S+\.\S+/.test(username))
            newErrors.username = "Email không hợp lệ";

        if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
        else if (password.length < 6)
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

        if (!fullname) newErrors.fullname = "Vui lòng nhập họ và tên";

        if (!phone) newErrors.phone = "Vui lòng nhập số điện thoại";
        else if (!/^\d{10,11}$/.test(phone))
            newErrors.phone = "Số điện thoại không hợp lệ (10 hoặc 11 chữ số)";

        if (!dateOfBirth) newErrors.dateOfBirth = "Vui lòng nhập Ngày sinh";
        if (!gender) newErrors.gender = "Vui lòng chọn Giới tính"; 
        if (!address) newErrors.address = "Vui lòng nhập Địa chỉ";
        if (!driverLicense) newErrors.driverLicense = "Vui lòng nhập GPLX";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            Alert.alert(
                "Lỗi",
                "Vui lòng điền đầy đủ thông tin và đúng định dạng!"
            );
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/register`,
                {
                    email: username,
                    password,
                    fullname: fullname.trim(), 
                    phone_number: phone.trim(),
                    date_of_birth: dateOfBirth.trim(),
                    gender: gender,
                    address: address.trim(),
                    driver_license_number: driverLicense.trim(),
                }
            );

            if (response.data.success) {
                Alert.alert(
                    "Thành công",
                    response.data.message || "Đăng ký thành công!"
                );

                setUsername("");
                setPassword("");
                setFullname("");
                setPhone("");
                setDateOfBirth(""); 
                setGender(""); 
                setAddress(""); 
                setDriverLicense(""); 
                setErrors({});

                navigation.replace("LoginScreen");
            } else {
                Alert.alert(
                    "Lỗi đăng ký",
                    response.data.message || "Đăng ký thất bại."
                );
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            if (error.response) {
                Alert.alert(
                    "Lỗi đăng ký",
                    error.response.data.message || "Có lỗi xảy ra khi đăng ký."
                );
            } else if (error.request) {
                Alert.alert(
                    "Lỗi mạng",
                    "Không thể kết nối tới server đăng ký. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau."
                );
            } else {
                Alert.alert(
                    "Lỗi",
                    "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginLink = () => {
        navigation.navigate("Login");
    };

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color="#6366F1" />
                            <Text style={styles.loadingText}>Đang đăng ký...</Text>
                        </View>
                    </View>
                )}
                
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                  
                    <View style={styles.welcomeSection}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Tạo tài khoản</Text>
                            <Text style={styles.subtitle}>
                                Tham gia cùng chúng tôi ngay hôm nay
                            </Text>
                        </View>
                    </View>

                  
                    <View style={styles.formSection}>
                      
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Email</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.username && styles.inputWrapperError
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="your@email.com"
                                        placeholderTextColor="#9CA3AF"
                                        value={username}
                                        onChangeText={(text) => {
                                            setUsername(text);
                                            setErrors({ ...errors, username: null });
                                        }}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                                {errors.username && (
                                    <Text style={styles.errorText}>{errors.username}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Mật khẩu</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.password && styles.inputWrapperError
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Tối thiểu 6 ký tự"
                                        placeholderTextColor="#9CA3AF"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            setErrors({ ...errors, password: null });
                                        }}
                                        autoCapitalize="none"
                                    />
                                </View>
                                {errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Họ và tên</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.fullname && styles.inputWrapperError
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nguyễn Văn A"
                                        placeholderTextColor="#9CA3AF"
                                        value={fullname}
                                        onChangeText={(text) => {
                                            setFullname(text);
                                            setErrors({ ...errors, fullname: null });
                                        }}
                                    />
                                </View>
                                {errors.fullname && (
                                    <Text style={styles.errorText}>{errors.fullname}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Số điện thoại</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.phone && styles.inputWrapperError
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="0123456789"
                                        placeholderTextColor="#9CA3AF"
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={(text) => {
                                            setPhone(text);
                                            setErrors({ ...errors, phone: null });
                                        }}
                                    />
                                </View>
                                {errors.phone && (
                                    <Text style={styles.errorText}>{errors.phone}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Địa chỉ</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.address && styles.inputWrapperError
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123 Đường ABC, Quận XYZ"
                                        placeholderTextColor="#9CA3AF"
                                        value={address}
                                        onChangeText={(text) => {
                                            setAddress(text);
                                            setErrors({ ...errors, address: null });
                                        }}
                                    />
                                </View>
                                {errors.address && (
                                    <Text style={styles.errorText}>{errors.address}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Ngày sinh</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.dateOfBirth && styles.inputWrapperError
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="YYYY-MM-DD"
                                        placeholderTextColor="#9CA3AF"
                                        value={dateOfBirth}
                                        onChangeText={(text) => {
                                            setDateOfBirth(text);
                                            setErrors({ ...errors, dateOfBirth: null });
                                        }}
                                        keyboardType="numbers-and-punctuation"
                                        autoCapitalize="none"
                                    />
                                </View>
                                {errors.dateOfBirth && (
                                    <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Giới tính</Text>
                                <View style={[
                                    styles.pickerWrapper,
                                    errors.gender && styles.inputWrapperError
                                ]}>
                                    <Picker
                                        selectedValue={gender}
                                        style={styles.picker}
                                        onValueChange={(itemValue) => {
                                            setGender(itemValue);
                                            setErrors({ ...errors, gender: null });
                                        }}
                                    >
                                        <Picker.Item label="Chọn giới tính" value="" />
                                        <Picker.Item label="Nam" value="Male" />
                                        <Picker.Item label="Nữ" value="Female" />
                                        <Picker.Item label="Khác" value="Other" />
                                    </Picker>
                                </View>
                                {errors.gender && (
                                    <Text style={styles.errorText}>{errors.gender}</Text>
                                )}
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Số giấy phép lái xe</Text>
                                <View style={[
                                    styles.inputWrapper,
                                    errors.driverLicense && styles.inputWrapperError
                                ]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="123456789"
                                        placeholderTextColor="#9CA3AF"
                                        value={driverLicense}
                                        onChangeText={(text) => {
                                            setDriverLicense(text);
                                            setErrors({ ...errors, driverLicense: null });
                                        }}
                                        autoCapitalize="none"
                                    />
                                </View>
                                {errors.driverLicense && (
                                    <Text style={styles.errorText}>{errors.driverLicense}</Text>
                                )}
                            </View>
                        </View>

                      
                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                isLoading && styles.registerButtonDisabled,
                            ]}
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            <Text style={styles.registerButtonText}>
                                {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                            </Text>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginSection}>
                            <Text style={styles.loginPrompt}>
                                Đã có tài khoản?{" "}
                            </Text>
                            <TouchableOpacity onPress={handleLoginLink}>
                                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    loadingBox: {
        backgroundColor: "#FFFFFF",
        padding: 24,
        borderRadius: 16,
        alignItems: "center",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        minWidth: 140,
    },
    loadingText: {
        marginTop: 12,
        color: "#374151",
        fontSize: 15,
        fontWeight: "500",
    },
    welcomeSection: {
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    titleContainer: {
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: "#6B7280",
        fontWeight: "400",
        textAlign: "center",
    },
    formSection: {
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
        marginBottom: 6,
    },
    inputWrapper: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        minHeight: 52,
        justifyContent: "center",
    },
    inputWrapperError: {
        borderColor: "#EF4444",
        backgroundColor: "#FEF2F2",
    },
    input: {
        fontSize: 16,
        color: "#1F2937",
        padding: 0,
        minHeight: 24,
    },
    pickerWrapper: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        overflow: "hidden",
    },
    picker: {
        height: 52,
        color: "#1F2937",
    },
    errorText: {
        color: "#EF4444",
        fontSize: 12,
        marginTop: 4,
        fontWeight: "500",
    },
    registerButton: {
        backgroundColor: "#6366F1",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 8,
        elevation: 2,
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    registerButtonDisabled: {
        backgroundColor: "#9CA3AF",
        elevation: 0,
        shadowOpacity: 0,
    },
    registerButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
    loginSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
        paddingVertical: 12,
    },
    loginPrompt: {
        fontSize: 15,
        color: "#6B7280",
        fontWeight: "400",
    },
    loginLink: {
        fontSize: 15,
        color: "#6366F1",
        fontWeight: "600",
    },
});