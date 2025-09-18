import { Text, TextProps } from 'react-native';
export default function AppText(props: TextProps) {
  return <Text {...props} style={[{ fontFamily: 'Inter_400Regular' }, props.style]} />;
}
