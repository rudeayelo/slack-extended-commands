import { Stack, Text, Heading } from "@rudeland/ui";

const Error = () => {
  const { data, isLoading } = { data: true, isLoading: false };

  if (isLoading || !data) return null;

  return (
    <Stack gap={10} direction="vertical" css={{ padding: 4, paddingTop: 8 }}>
      <Stack gap={5} direction="vertical">
        <Stack justify="space-between" align="flex-end">
          <Heading>Slack Extended Commands</Heading>
        </Stack>

        <Text>Success</Text>
      </Stack>
    </Stack>
  );
};

export default Error;
