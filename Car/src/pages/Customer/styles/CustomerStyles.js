import { StyleSheet, Platform, Dimensions } from 'react-native';

export const CustomerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: 16,
    paddingBlock: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { inlineSize: 0, blockSize: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#363636',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    insetBlockEnd: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#363636',
    insetBlockEnd: 12,
  },
  inputContainer: {
    insetBlockEnd: 16,
  },
  input: {
    borderInlineSize: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    paddingInline: 12,
    paddingBlock: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#363636',
  },
  inputError: {
    borderColor: '#ff3860',
  },
  inputChanged: {
    backgroundColor: '#f0f9ff',
  },
  errorText: {
    color: '#ff3860',
    fontSize: 12,
    insetBlockStart: 4,
    insetInlineStart: 4,
  },
  buttonContainer: {
    insetBlockStart: 24,
    insetBlockEnd: Platform.OS === 'ios' ? 34 : 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBlock: 12,
    paddingInline: 24,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#00d1b2',
  },
  buttonDisabled: {
    backgroundColor: '#b5b5b5',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    insetInlineStart: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { inlineSize: 0, blockSize: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loadingText: {
    color: '#363636',
    fontSize: 14,
    fontWeight: '500',
    insetBlockStart: 8,
    textAlign: 'center',
  },
  pickerContainer: {
    borderInlineSize: 1,
    borderColor: '#dbdbdb',
    borderRadius: 8,
    overflow: 'hidden',
    insetBlockEnd: 16,
  },
  picker: {
    inlineSize: '100%',
    color: '#363636',
  },
});
