import * as React from 'react';
import { parse } from 'yaml';
import IVSPlayer, {
  IVSPlayerProps,
  IVSPlayerRef,
  LogLevel,
  Quality,
} from 'amazon-ivs-react-native-player';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Chip, Subheading, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { proxy, useSnapshot } from 'valtio';

// const URL =
//   'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

type PlanProps = Record<string, any>;

enum PlanInputType {
  Boolean,
  Number,
  Options,
  Quality,
  Action,
}

type PlanInputOption = {
  name: string;
  value: any;
};

enum PlanInputActionArg {
  Number,
  String,
}

type PlanInput = {
  name?: string;
  type: PlanInputType;
  icon?: string;
  args?: PlanInputActionArg[];
  options?: PlanInputOption[];
  default?: any;
};

const InputTemplates: Record<string, PlanInput> = {
  // PROPS
  paused: { type: PlanInputType.Boolean },
  muted: { type: PlanInputType.Boolean },
  loop: { type: PlanInputType.Boolean },
  autoplay: { type: PlanInputType.Boolean },
  //   streamUrl?: string; this is set by url:
  liveLowLatency: { type: PlanInputType.Boolean },
  rebufferToLive: { type: PlanInputType.Boolean },
  playbackRate: { type: PlanInputType.Number },
  logLevel: {
    type: PlanInputType.Options,
    options: [
      { name: 'debug', value: LogLevel.IVSLogLevelDebug },
      { name: 'info', value: LogLevel.IVSLogLevelInfo },
      { name: 'warning', value: LogLevel.IVSLogLevelWarning },
      { name: 'error', value: LogLevel.IVSLogLevelError },
    ],
  },
  resizeMode: {
    type: PlanInputType.Options,
    options: [
      { name: 'fill', value: 'aspectFill' },
      { name: 'fit', value: 'aspectFit' },
      { name: 'zoom', value: 'aspectZoom' },
    ],
  },
  progressInterval: { type: PlanInputType.Number },
  volume: { type: PlanInputType.Number },
  quality: { type: PlanInputType.Quality },
  autoMaxQuality: { type: PlanInputType.Quality },
  autoQualityMode: { type: PlanInputType.Boolean },
  //   breakpoints: { type: PlanInputType.Boolean }, todo, do this later ??
  maxBitrate: { type: PlanInputType.Number },
  initialBufferDuration: { type: PlanInputType.Number },
  pipEnabled: { type: PlanInputType.Boolean },
  // REF API
  play: { type: PlanInputType.Action, icon: 'play' },
  pause: { type: PlanInputType.Action, icon: 'pause' },
  seekTo: {
    type: PlanInputType.Action,
    args: [PlanInputActionArg.Number],
  },
  setOrigin: {
    type: PlanInputType.Action,
    args: [PlanInputActionArg.String],
  },
  togglePip: { type: PlanInputType.Action },
};

const defaultPlan = `url: https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8
inputs:
`;

const planState = proxy<{
  url: string;
  props: PlanProps;
  inputs: PlanInput[];
  actions: Record<string, PlanProps>;
  qualities: Quality[];
}>({
  url: '',
  props: {},
  inputs: [],
  actions: {},
  qualities: [],
});

function qualitymatch(a: Quality | undefined, b: Quality | undefined) {
  // @ts-expect-error quick compare
  return a && b && Object.keys(a).every((key) => a[key] === b[key]);
}

type PlayerProps = {
  playerRef: React.Ref<IVSPlayerRef>;
} & IVSPlayerProps;

function Player({ playerRef, ...props }: PlayerProps) {
  const [logs, setLogs] = React.useState<string[]>([]);

  function log(message: string) {
    console.log(message);
    setLogs((logs) => [message, ...logs.slice(0, 30)]);
  }

  return (
    <IVSPlayer
      {...props}
      ref={playerRef}
      onSeek={(position) => {
        log(`onSeek: ${position}`);
      }}
      onData={(data) => {
        planState.qualities = data.qualities;
      }}
      onVideoStatistics={(data) => {
        console.log('onVideoStatistics', data);
      }}
      onPlayerStateChange={(state) => {
        log(`onPlayerStateChange: ${state}`);
      }}
      onDurationChange={(duration) => {
        log(`onDurationChange: ${duration}`);
      }}
      onQualityChange={(quality) => {
        console.log('quality changed', quality);
      }}
      onPipChange={(isActive) => {
        log(`onPipChange: ${isActive}`);
      }}
      onRebuffering={() => {
        log(`onRebuffering:`);
      }}
      onLoadStart={() => {
        log(`onLoadStart:`);
      }}
      onLoad={(duration) => {
        log(`onLoad: ${duration}`);
      }}
      onLiveLatencyChange={(liveLatency) => {
        log(`onLiveLatencyChange: ${liveLatency}`);
      }}
      onTextCue={(textCue) => {
        log(`onTextCue: ${JSON.stringify(textCue)}`);
      }}
      onTextMetadataCue={(textMetadataCue) => {
        log(`onTextMetadataCue: ${JSON.stringify(textMetadataCue)}`);
      }}
      onProgress={() => {
        // console.log('progress', progress);
      }}
      onError={(error: string) => {
        log(`onError: ${error}`);
      }}
      onTimePoint={(position) => {
        log(`onTimePoint: ${position}`);
      }}
    >
      {logs.map((log, index) => (
        <Text key={index} style={styles.log} accessibilityLabel={log}>
          {log}
        </Text>
      ))}
    </IVSPlayer>
  );
}

export function Testing() {
  const snapshot = useSnapshot(planState);
  const [testPlan, setTestPlan] = React.useState(defaultPlan);
  const playerRef = React.useRef<IVSPlayerRef>(null);

  function runplan() {
    const plandata = parse(testPlan);
    Object.keys(plandata).forEach((name) => {
      const lname = name.toLowerCase();
      const value = plandata[name];
      switch (lname) {
        case 'url':
          if (typeof value === 'string') {
            planState.url = value;
          } else {
            // throw error with example input
          }
          break;
        case 'inputs':
          if (Array.isArray(value)) {
            const newInputs: PlanInput[] = [];

            value.forEach((input) => {
              if (typeof input === 'string') {
                const template = InputTemplates[input];
                if (template) {
                  newInputs.push({ name: input, ...template });
                }
              } else {
                Object.entries(input).forEach(([prop, data]) => {
                  const template = InputTemplates[prop];
                  if (template) {
                    planState.props[prop] = data;
                    newInputs.push({ name: prop, ...template });
                  }
                });
              }
            });

            planState.inputs = newInputs;
          } else {
            // throw error with example input
          }
          break;
        default:
          console.info(lname, plandata[name]);
          break;
      }
    });
  }

  function renderinput(input: PlanInput) {
    const name = input.name ?? '';
    const value = snapshot.props[name];
    switch (input.type) {
      case PlanInputType.Boolean:
        return (
          <>
            <Subheading>{name}</Subheading>
            <Chip
              testID={name}
              selected={!!value}
              onPress={() => {
                planState.props[name] = !value;
              }}
            >
              {JSON.stringify(value)}
            </Chip>
          </>
        );
      case PlanInputType.Number:
        return (
          <>
            <Subheading>{name}</Subheading>
            <TextInput
              testID={name}
              dense
              value={`${value}`}
              onChangeText={(text) => {
                const next = parseFloat(text);
                planState.props[name] = Number.isNaN(next) ? 0 : next;
              }}
            />
          </>
        );
      case PlanInputType.Options:
        return (
          <>
            <Subheading>{name}</Subheading>
            {(input.options ?? []).map((option, index) => {
              return (
                <Chip
                  key={index}
                  testID={`${name}:${option.name}:${index}`}
                  selected={option.value === value}
                  onPress={() => {
                    planState.props[name] = option.value;
                  }}
                >
                  {option.name}: {JSON.stringify(option.value)}
                </Chip>
              );
            })}
          </>
        );
      case PlanInputType.Quality:
        return (
          <>
            <Subheading>{name}</Subheading>
            <Chip
              testID={`${name}:auto:-1`}
              selected={value === undefined}
              onPress={() => {
                planState.props[name] = undefined;
              }}
            >
              auto: undefined
            </Chip>
            {snapshot.qualities.map((option, index) => {
              return (
                <Chip
                  key={index}
                  testID={`${name}:${option.name}:${index}`}
                  selected={qualitymatch(option, value)}
                  onPress={() => {
                    planState.props[name] = option;
                  }}
                >
                  {option.name}: {JSON.stringify(option)}
                </Chip>
              );
            })}
          </>
        );
      case PlanInputType.Action:
        return (
          <>
            <View style={styles.row}>
              {(input.args ?? []).map((arg, i) => {
                switch (arg) {
                  case PlanInputActionArg.Number:
                    return (
                      <TextInput
                        key={i}
                        testID={`${name}:${i}`}
                        dense
                        style={styles.rowInput}
                        value={`${planState.actions?.[name]?.[i] ?? ''}`}
                        onChangeText={(text) => {
                          if (!snapshot.actions[name]) {
                            planState.actions[name] = {};
                          }
                          const next = parseFloat(text);
                          planState.actions[name][i] = Number.isNaN(next)
                            ? 0
                            : next;
                        }}
                      />
                    );
                  case PlanInputActionArg.String:
                    return (
                      <TextInput
                        key={i}
                        testID={`${name}:${i}`}
                        dense
                        style={styles.rowInput}
                        value={planState.actions?.[name]?.[i] ?? ''}
                        onChangeText={(text) => {
                          if (!snapshot.actions[name]) {
                            planState.actions[name] = {};
                          }
                          planState.actions[name][i] = text;
                        }}
                      />
                    );
                  default:
                    return null;
                }
              })}
              <Button
                testID={`${name}`}
                icon={input.icon}
                mode="contained"
                onPress={() => {
                  if (!playerRef.current) {
                    return;
                  }
                  switch (name) {
                    case 'play':
                      playerRef.current.play();
                      break;
                    case 'pause':
                      playerRef.current.pause();
                      break;
                    case 'seekTo':
                      playerRef.current.seekTo(snapshot.actions[name][0]);
                      break;
                    case 'setOrigin':
                      playerRef.current.setOrigin(snapshot.actions[name][0]);
                      break;
                    case 'togglePip':
                      playerRef.current.togglePip();
                      break;
                  }
                }}
              >
                {name}
              </Button>
            </View>
          </>
        );
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.player}>
        <Player
          streamUrl={snapshot.url}
          playerRef={playerRef}
          {...snapshot.props}
        />
      </View>
      <View style={styles.config}>
        {snapshot.inputs.map((input, index) => (
          <View key={input.name ?? index} style={styles.input}>
            {renderinput(input as PlanInput)}
          </View>
        ))}
        <View style={styles.input}>
          <Button testID="planRun" mode="contained" onPress={runplan}>
            Run Plan
          </Button>
        </View>
        <TextInput
          testID="planText"
          style={styles.testPlan}
          label="Test Plan"
          dense
          multiline
          value={testPlan}
          onChangeText={setTestPlan}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
    backgroundColor: '#acf',
  },
  player: {
    marginVertical: 2,
    marginHorizontal: 8,
    height: 256,
    overflow: 'hidden',
  },
  log: {
    fontSize: 7,
  },
  config: {
    flex: 1,
  },
  input: {
    marginBottom: 10,
    marginHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
    marginRight: 10,
  },
  testPlan: {
    flex: 1,
    minHeight: 400,
  },
});
