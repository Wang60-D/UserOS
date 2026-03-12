import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import StandardPageLayout from '../../shared/StandardPageLayout';
import Label2SwitchRow from './Label2SwitchRow';
import type { Label2RouteName } from './Label2Routes';

interface Label2PageLayoutProps {
  imageSource: ReturnType<typeof require>;
  activeRoute: Label2RouteName;
  children: React.ReactNode;
}

const Label2PageLayout: React.FC<Label2PageLayoutProps> = ({
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
    <StandardPageLayout title="Label-2" imageSource={imageSource} footer={<Label2SwitchRow activeRoute={activeRoute} />}>
      {children}
    </StandardPageLayout>
  );
};

export default Label2PageLayout;
