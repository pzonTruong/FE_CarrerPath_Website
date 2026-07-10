import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NodeTestProps {
  careerId: string;
  stepId: string;
  onCompleteSuccess: () => void;
}

export const NodeTest: React.FC<NodeTestProps> = ({ careerId, stepId }) => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Navigate to QuizPage, passing stepId as skillId to match backend expectation,
    // and passing careerId and stepId as query params.
    navigate(`/quiz/${stepId}?careerId=${careerId}&stepId=${stepId}`);
  };

  return (
    <div className="mt-4 p-5 border-2 border-foreground bg-card text-card-foreground rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(250,250,250,0.15)]">
      <h4 className="font-mono font-bold uppercase text-xs tracking-wider text-primary mb-3 border-b-2 border-dashed border-foreground pb-2">
        Bài Kiểm Tra Đánh Giá Năng Lực
      </h4>
      
      <p className="font-sans text-xs sm:text-sm mb-5 text-muted-foreground leading-relaxed">
        Để hoàn thành bài học này, bạn cần thực hiện một bài kiểm tra ngắn. 
        Bài kiểm tra gồm 15 câu hỏi trắc nghiệm ngẫu nhiên bám sát nội dung chuyên môn. 
        Bạn cần đạt tối thiểu <strong className="text-foreground font-bold">80%</strong> để vượt qua.
      </p>

      <button
        onClick={handleStartQuiz}
        className="w-full py-3 bg-primary text-primary-foreground font-mono font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(250,250,250,0.15)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all rounded-[2px] cursor-pointer"
      >
        Bắt đầu làm bài kiểm tra
      </button>
    </div>
  );
};
