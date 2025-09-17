import GameRoom from '@/components/GameRoom';

interface Props {
  params: { roomId: string };
}

export default function GamePage({ params }: Props) {
  const { roomId } = params;
  return <GameRoom roomId={roomId} />;
}
