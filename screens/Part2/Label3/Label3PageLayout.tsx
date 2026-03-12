import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import StandardPageLayout from '../../shared/StandardPageLayout';
import Label3SwitchRow from './Label3SwitchRow';
import type { Label3RouteName } from './Label3Routes';

interface Label3PageLayoutProps {
  imageSource: ReturnType<typeof require>;
  activeRoute: Label3RouteName;
  children: React.ReactNode;
}

const Label3PageLayout: React.FC<Label3PageLayoutProps> = ({
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
    <StandardPageLayout title="Label-3" imageSource={imageSource} footer={<Label3SwitchRow activeRoute={activeRoute} />}>
      {children}
    </StandardPageLayout>
  );
};

export default Label3PageLayout;
