import GenerationHistoryComponent from '@/components/GenerationHistory';

export const metadata = {
  title: 'Generation History - AI Video Generator',
  description: 'View and manage your AI-generated video history'
};

export default function HistoryPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <GenerationHistoryComponent />
    </div>
  );
}