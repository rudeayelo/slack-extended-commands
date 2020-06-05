import { Stack, Button, Text, Heading } from "@rudeland/ui";
import { useAuth } from "src/providers/AuthProvider";

const SlackIcon = () => (
  <svg
    fill="currentColor"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const Index = () => {
  const { user } = useAuth();
  const { data, isLoading } = { data: true, isLoading: false };

  if (isLoading || !data) return null;

  return (
    <Stack gap={10} direction="vertical" css={{ padding: 4, paddingTop: 8 }}>
      <Stack gap={5} direction="vertical" align="start">
        <Stack justify="space-between" align="flex-end">
          <Heading>Slack Extended Commands</Heading>
        </Stack>

        {user && <Text>User is logged in</Text>}

        <Button
          as="a"
          size="large"
          href="https://slack.com/oauth/v2/authorize?client_id=628291344193.1148234540627&user_scope=chat:write,channels:history,groups:history,im:history,mpim:history,users.profile:write,users:write,dnd:write&scope=commands&redirect_uri=https://9c9b8efabdc1.ngrok.io/api/callback"
          iconBefore={<SlackIcon />}
          style={{ textDecoration: "none" }}
        >
          Connect to Slack
        </Button>
      </Stack>
    </Stack>
  );
};

export async function getStaticProps(ctx) {
  console.log("ctx.req.headers.cookie", ctx);
  return {
    props: {},
  };
}

export default Index;
