import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import TickMarks2SwitchRow from './TickMarks2SwitchRow';
import type { TickMarks2RouteName } from './TickMarks2Routes';
import StandardPageLayout from '../../shared/StandardPageLayout';

interface TickMarks2PageLayoutProps {
  imageSource: ReturnType<typeof require>;
  activeRoute: TickMarks2RouteName;
  children: React.ReactNode;
}

const TickMarks2PageLayout: React.FC<TickMarks2PageLayoutProps> = ({
  imageSource,
  activeRoute,
  children,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      const actionType = event.data.action.type;
      if (actionType !== 'GO_BACK' && actionType !== 'POP') return;
      event.preventDefault();
      navigation.navigate('Part2');
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <StandardPageLayout
      title="Tick marks2 等分"
      imageSource={imageSource}
      footer={<TickMarks2SwitchRow activeRoute={activeRoute} />}
    >
      {children}
    </StandardPageLayout>
  );
};

export default TickMarks2PageLayout;
