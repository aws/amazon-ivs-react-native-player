import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-expect-error these values come from .env file
import { GIT_BRANCH, GIT_COMMIT } from '@env';
import type { RootStackParamList } from '../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

function Home() {
  const { navigate } = useNavigation<HomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <View style={styles.description}>
        <Paragraph>React Native Amazon IVS Player - examples</Paragraph>
      </View>

      <ScrollView style={styles.list}>
        <Card
          testID="TestPlan"
          style={styles.card}
          onPress={() => {
            navigate('TestPlan');
          }}
        >
          <Card.Title title="TestPlan" />
          <Card.Content>
            <Paragraph>Testing harness for the player.</Paragraph>
          </Card.Content>
        </Card>
        <Card
          testID="Simple"
          style={styles.card}
          onPress={() => {
            navigate('SimpleExample');
          }}
        >
          <Card.Title title="Simple" />
          <Card.Content>
            <Paragraph>The simplest implementation of player.</Paragraph>
          </Card.Content>
        </Card>
        <Card
          testID="Advanced"
          style={styles.card}
          onPress={() => {
            navigate('AdvancedExample');
          }}
        >
          <Card.Title title="Advanced" />
          <Card.Content>
            <Paragraph>
              More advanced implementation that allows stream management.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card
          testID="Swipeable"
          style={styles.card}
          onPress={() => {
            navigate('SwipeableExample');
          }}
        >
          <Card.Title title="Swipeable" />
          <Card.Content>
            <Paragraph>
              A simple implementation of a swipeable video flow.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card
          testID="Playground"
          style={styles.card}
          onPress={() => {
            navigate('PlaygroundExample');
          }}
        >
          <Card.Title title="Playground" />
          <Card.Content>
            <Paragraph>
              Playground implementation to test and experiment with all props,
              refs and callbacks.
            </Paragraph>
          </Card.Content>
        </Card>
        <Card testID="Version" style={styles.card}>
          <Card.Title title="Version" />
          <Card.Content>
            <Paragraph>
              {GIT_BRANCH} @ {GIT_COMMIT}
            </Paragraph>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  list: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
});

export default Home;
