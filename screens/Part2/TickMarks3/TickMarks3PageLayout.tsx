import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import TickMarks3SwitchRow from './TickMarks3SwitchRow';
import type { TickMarks3RouteName } from './TickMarks3Routes';
import StandardPageLayout from '../../shared/StandardPageLayout';

interface TickMarks3PageLayoutProps {
  imageSource: ReturnType<typeof require>;
  activeRoute: TickMarks3RouteName;
  children: React.ReactNode;
}

const TickMarks3PageLayout: React.FC<TickMarks3PageLayoutProps> = ({
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
      title="Tick marks3 整数偏好"
      imageSource={imageSource}
      footer={<TickMarks3SwitchRow activeRoute={activeRoute} />}
    >
      {children}
    </StandardPageLayout>
  );
};

export default TickMarks3PageLayout;
