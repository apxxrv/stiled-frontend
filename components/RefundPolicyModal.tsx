import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CheckCircle, AlertTriangle, X as XIcon } from 'lucide-react-native';

interface RefundPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export function RefundPolicyModal({ visible, onClose }: RefundPolicyModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold">Cancellation & Refund Policy</Text>
          <TouchableOpacity onPress={onClose}>
            <XIcon size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="space-y-4">
            <View className="space-y-3">
              <View className="flex-row items-start space-x-3">
                <CheckCircle size={20} color="#10b981" />
                <View>
                  <Text className="font-medium">24+ Hours Before</Text>
                  <Text className="text-sm text-gray-600">100% refund guaranteed</Text>
                </View>
              </View>
              <View className="flex-row items-start space-x-3">
                <AlertTriangle size={20} color="#f59e0b" />
                <View>
                  <Text className="font-medium">Within 24 Hours</Text>
                  <Text className="text-sm text-gray-600">50% refund available</Text>
                </View>
              </View>
              <View className="flex-row items-start space-x-3">
                <XIcon size={20} color="#ef4444" />
                <View>
                  <Text className="font-medium">No Shows</Text>
                  <Text className="text-sm text-gray-600">No refund available</Text>
                </View>
              </View>
            </View>
            <View className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <View className="flex-row items-start space-x-2">
                <AlertTriangle size={16} color="#f59e0b" />
                <Text className="text-sm text-yellow-800">
                  Refunds are processed within 3-5 business days to your original payment method.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}