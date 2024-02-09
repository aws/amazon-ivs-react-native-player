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
  action?: PlanInputActionArg[];
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
    action: [PlanInputActionArg.Number],
  },
  setOrigin: {
    type: PlanInputType.Action,
    action: [PlanInputActionArg.String],
  },
  togglePip: { type: PlanInputType.Action },
};

const defaultPlan = `url: https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8
inputs:
`;

function qualitymatch(a: Quality | undefined, b: Quality | undefined) {
  // @ts-expect-error quick compare
  return a && b && Object.keys(a).every((key) => a[key] === b[key]);
}

type PlayerProps = {
  playerRef: React.Ref<IVSPlayerRef>;
  setQualities: (qualities: Quality[]) => void;
} & IVSPlayerProps;

function Player({ playerRef, setQualities, ...props }: PlayerProps) {
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
        setQualities(data.qualities);
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
  const [url, setUrl] = React.useState('');
  const [plan, setPlan] = React.useState(defaultPlan);
  const [qualities, setQualities] = React.useState<Quality[]>([]);
  const [props, setProps] = React.useState<PlanProps>({});
  const [inputs, setInputs] = React.useState<PlanInput[]>([]);
  const playerRef = React.useRef<IVSPlayerRef>(null);

  function runplan() {
    const plandata = parse(plan);
    Object.keys(plandata).forEach((name) => {
      const lname = name.toLowerCase();
      const value = plandata[name];
      switch (lname) {
        case 'url':
          if (typeof value === 'string') {
            setUrl(value);
          } else {
            // throw error with example input
          }
          break;
        case 'inputs':
          if (Array.isArray(value)) {
            const newProps: PlanProps = {};
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
                    newProps[prop] = data;
                    newInputs.push({ name: prop, ...template });
                  }
                });
              }
            });
            setInputs(newInputs);
            setProps((state) => ({ ...state, ...newProps }));
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
    const value = props[name];
    switch (input.type) {
      case PlanInputType.Boolean:
        return (
          <>
            <Subheading>{name}</Subheading>
            <Chip
              testID={name}
              selected={!!value}
              onPress={() => {
                setProps((state) => ({ ...state, [name]: !value }));
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
                setProps((state) => {
                  const next = parseFloat(text);
                  return { ...state, [name]: Number.isNaN(next) ? 0 : next };
                });
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
                    setProps((state) => ({ ...state, [name]: option.value }));
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
                setProps((state) => ({ ...state, [name]: undefined }));
              }}
            >
              auto: undefined
            </Chip>
            {qualities.map((option, index) => {
              return (
                <Chip
                  key={index}
                  testID={`${name}:${option.name}:${index}`}
                  selected={qualitymatch(option, value)}
                  onPress={() => {
                    setProps((state) => ({ ...state, [name]: option }));
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
            <Chip
              testID={`${name}`}
              icon={input.icon}
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
                    break;
                  case 'setOrigin':
                    break;
                  case 'togglePip':
                    playerRef.current.togglePip();
                    break;
                }
              }}
            >
              {name}
            </Chip>
          </>
        );
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.player}>
        <Player
          streamUrl={url}
          playerRef={playerRef}
          setQualities={setQualities}
          {...props}
        />
      </View>
      <View style={styles.config}>
        {inputs.map((input, index) => (
          <View key={input.name ?? index} style={styles.input}>
            {renderinput(input)}
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
          value={plan}
          onChangeText={setPlan}
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
  testPlan: {
    flex: 1,
    minHeight: 400,
  },
});
