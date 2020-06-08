import { Stack, Text, Heading } from "@rudeland/ui";

const Error = () => (
  <Stack gap={10} direction="vertical" css={{ padding: 4, paddingTop: 8 }}>
    <Stack gap={5} direction="vertical">
      <Stack justify="space-between" align="flex-end">
        <Heading>Slack Extended Commands</Heading>
      </Stack>

      <Text>Error</Text>
    </Stack>
  </Stack>
);

export default Error;
