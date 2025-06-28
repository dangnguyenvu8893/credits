'use client';

import { useState } from 'react';
import Link from 'next/link';

interface UserActionsProps {
  userId: string;
  userName: string;
}

export default function UserActions({ userId, userName }: UserActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Reload the page to refresh the user list
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa người dùng');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Link
        href={`/users/${userId}`}
        className="text-blue-400 hover:text-blue-300 transition-colors"
      >
        Xem
      </Link>
      <button
        className={`text-red-400 hover:text-red-300 transition-colors ${
          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Đang xóa...' : 'Xóa'}
      </button>
    </div>
  );
} 