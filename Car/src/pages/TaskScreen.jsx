import React , { useState} from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";





const TaskScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAllContract = () => {
    navigation.navigate("AllCT");
  }
  const openListModal = () => {
    setModalVisible(true);
  };

  const closeListModal = () => {
    setModalVisible(false);
  };

  const navigateTo = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen);
  };
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={[styles.option, { margin: 10, borderRadius: 50, borderTopColor: "#ddd", borderTopWidth: 1, height: 70, }]}>
          <Text style={{ color: 'blue' }}><Icon name='map-marker-outline' size={24} style={{ color: 'blue' }} /> Hội sở</Text>
          <Icon name="chevron-down" size={30} color={"#999"} />
        </TouchableOpacity>

        <Text style={styles.header}>Vận hành</Text>

        <TouchableOpacity style={[styles.option, { borderTopRightRadius: 10, borderTopLeftRadius: 10, borderTopWidth: 1, borderTopColor: "#ddd" }]} onPress={handleAllContract}>
          <Text><Icon name='file' size={24} color={'blue'} /> Hợp đồng ngày</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => { }}>
          <Text><Icon name='file-outline' size={24} color={'blue'} /> Hợp đồng tháng</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text><Icon name='file-move' size={24} color={'blue'} /> Hợp đồng chuyển đi</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate("VerifyBooking") }}>
          <Text><Icon name='car' size={24} color={'blue'} /> Giao nhận xe</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text><Icon name='calendar' size={24} color={'blue'} /> Lịch xe</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text><Icon name='cash-multiple' size={24} color={'blue'} /> Sổ quỹ </Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text><Icon name='account-cash' size={24} color={'blue'} /> Công nợ</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => { navigation.navigate("maintenance") }}>
          <Text><Icon name='tools' size={24} color={'blue'} /> Bảo dưỡng sửa chữa</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={openListModal}>
          <Text><Icon name='format-list-bulleted' size={24} color={'blue'} /> Danh sách</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, }]}>
          <Text><Icon name='file-chart' size={24} color={'blue'} /> Báo cáo</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <Text style={styles.header}>Quản lý chung</Text>

        <TouchableOpacity style={[styles.option, { borderTopRightRadius: 10, borderTopLeftRadius: 10, borderTopWidth: 1, borderTopColor: "#ddd" }]}>
          <Text><Icon name='domain' size={24} color={'blue'} /> Thông tin doanh nghiệp</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text><Icon name='office-building' size={24} color={'blue'} /> Chi nhánh</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text><Icon name='account-group' size={24} color={'blue'} /> Nhân viên và vai trò</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, { borderBottomLeftRadius: 10, borderBottomRightRadius: 10, }]}>
          <Text><Icon name='cog' size={24} color={'blue'} /> Cấu hình</Text>
          <Icon name="chevron-right" size={30} color={"#999"} />
        </TouchableOpacity>

      </ScrollView>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={closeListModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chọn danh sách</Text>

          <TouchableOpacity style={styles.modalItem} onPress={() => navigateTo("ListCus")}>
            <Icon name="account" size={22} color="blue" />
            <Text style={styles.modalItemText}>Khách hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalItem} onPress={() => navigateTo("VehicleListScreen")}>
            <Icon name="car" size={22} color="blue" />
            <Text style={styles.modalItemText}>Danh sách xe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalItem}>
            <Icon name="bank" size={22} color="blue" />
            <Text style={styles.modalItemText}>Tài khoản ngân hàng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  option: {
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: "#ddd",
    borderLeftColor: "#ddd",
    borderRightColor: "#ddd",
    justifyContent: 'space-between',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default TaskScreen;
