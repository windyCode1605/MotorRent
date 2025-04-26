import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


import carIcon from "../assets/image4.png";
import lineChartIcon from "../assets/image4.png";
import documentIcon from "../assets/image4.png";

export default function App() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>HỘI SỞ</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.section, styles.vehicleSection]}>
                    <View style={styles.sectionHeader}>
                        <Image source={carIcon} style={styles.icon} />
                        <Text style={styles.sectionTitleBlack}>Thuê xe</Text>
                        <TouchableOpacity style={styles.todayButton}>
                            <Text style={styles.todayText}>Hôm nay</Text>
                            <Ionicons name="repeat" size={16} color="#007bff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statBoxWhite}>
                        <View style={styles.statsColumn}>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>
                                    Số hợp đồng
                                </Text>
                                <Text style={styles.statValue}>0</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>
                                    Tổng tiền hợp đồng
                                </Text>
                                <Text style={styles.statValue}>0</Text>
                            </View>
                            <View style={styles.statRow}>
                                <Text style={styles.statLabel}>
                                    Tổng tiền chuyến đi
                                </Text>
                                <Text style={styles.statValue}>0</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Dòng tiền Section */}
                <View style={[styles.section, styles.moneySection]}>
                    <View style={styles.sectionHeader}>
                        <Image source={lineChartIcon} style={styles.icon} />
                        <Text style={styles.sectionTitleBlack}>Dòng tiền</Text>
                        <TouchableOpacity style={styles.todayButton}>
                            <Text style={styles.todayText}>Hôm nay</Text>
                            <Ionicons name="repeat" size={16} color="#007bff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.statBoxWhite}>
                        <View style={styles.statsColumn}>
                            <TouchableOpacity
                                style={styles.statRow}
                                onPress={() => console.log("Nhấn vào Thu")}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.statLabelBold}>Thu</Text>
                                <Text style={styles.statValue}>0</Text>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.statRow}
                                onPress={() => console.log("Nhấn vào Chi")}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.statLabelBold}>Chi</Text>
                                <Text style={styles.statValue}>0</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Tổng số hợp đồng Section */}
                <View style={[styles.section, { backgroundColor: "#6a5acd" }]}>
                    <View style={styles.sectionHeader}>
                        <Image source={documentIcon} style={styles.icon} />
                        <Text style={styles.sectionTitleWhite}>
                            Tổng số hợp đồng
                        </Text>
                    </View>
                    <View style={styles.totalContractsContainer}>
                        <View style={styles.chartPlaceholderLarge}>
                            <Text style={styles.chartTextLarge}>0</Text>
                        </View>
                        <View style={styles.statsColumn}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabelWhite}>
                                    Chờ xác nhận
                                </Text>
                                <Text style={styles.statValueWhite}>0</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabelWhite}>
                                    Đã xác nhận
                                </Text>
                                <Text style={styles.statValueWhite}>0</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabelWhite}>
                                    Đã nhận xe
                                </Text>
                                <Text style={styles.statValueWhite}>0</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabelWhite}>
                                    Đã trả xe
                                </Text>
                                <Text style={styles.statValueWhite}>0</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabelWhite}>
                                    Xe tai nạn
                                </Text>
                                <Text style={styles.statValueWhite}>0</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Cảnh báo Section */}
                <View style={[styles.section, styles.warningSection]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="warning" size={20} color="white" />
                        <Text style={styles.sectionTitleWhite}>Cảnh báo</Text>
                    </View>
                    <Text style={styles.warningText}>Xe đến hạn</Text>
                    <Text style={styles.warningSubText}>
                        Danh sách xe đến hạn
                    </Text>
                    <Text style={styles.warningText}>Phạt nguội</Text>
                    <Text style={styles.warningSubText}>
                        Danh sách lỗi phạt nguội chưa xử lý
                    </Text>
                </View>

                {/* Bottom Buttons */}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={styles.bottomButton}>
                        <Text style={styles.bottomButtonText}>Top dịch vụ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomButton}>
                        <Text style={styles.bottomButtonText}>Top xe thuê</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        paddingTop: 40,
        backgroundColor: "#f5f5f5",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    headerPlaceholder: {
        width: 24,
    },
    scrollContent: {
        padding: 16,
    },
    section: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    vehicleSection: {
        backgroundColor: "#6a5acd",
    },
    moneySection: {
        backgroundColor: "#d3d3d3",
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitleWhite: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#fff",
    },
    sectionTitleBlack: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#000",
    },
    todayButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e6e6e6",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 16,
    },
    todayText: {
        fontSize: 12,
        marginRight: 4,
        color: "#333",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statsColumn: {
        flex: 1,
        justifyContent: "space-between",
    },
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
        width: "100%",
    },
    divider: {
        height: 1,
        backgroundColor: "#d3d3d3", // Đường kẻ mờ màu xám
        marginVertical: 8, // Khoảng cách trên dưới của đường kẻ
    },
    statBoxWhite: {
        flex: 1,
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textAlign: "left",
        marginBottom: 8,
    },
    statLabelBold: {
        fontSize: 12,
        color: "#666",
        textAlign: "left",
        marginBottom: 8,
        fontWeight: "600",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#007bff",
    },
    totalContractsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    chartPlaceholderLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    chartTextLarge: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#6a5acd",
    },
    statItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    statLabelWhite: {
        fontSize: 12,
        color: "#fff",
    },
    statValueWhite: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    warningSection: {
        backgroundColor: "#8D84A4",
    },
    warningText: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#fff",
    },
    warningSubText: {
        fontSize: 12,
        color: "#d3d3d3",
        marginBottom: 16,
    },
    bottomButtons: {
        flexDirection: "column",
    },
    bottomButton: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 4,
    },
    bottomButtonText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    icon: {
        width: 20,
        height: 20,
        backgroundColor: "transparent",
    },
});