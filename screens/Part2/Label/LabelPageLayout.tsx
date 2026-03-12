import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import LabelSwitchRow from './LabelSwitchRow';
import type { LabelRouteName } from './LabelRoutes';
import StandardPageLayout from '../../shared/StandardPageLayout';

interface LabelPageLayoutProps {
  imageSource: ReturnType<typeof require>;
  activeRoute: LabelRouteName;
  children: React.ReactNode;
}

const LabelPageLayout: React.FC<LabelPageLayoutProps> = ({ imageSource, activeRoute, children }) => {
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
    <StandardPageLayout title="Label" imageSource={imageSource} footer={<LabelSwitchRow activeRoute={activeRoute} />}>
      {children}
    </StandardPageLayout>
  );
};

export default LabelPageLayout;
