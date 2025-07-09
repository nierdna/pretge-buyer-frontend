'use client';
import Link from 'next/link';

const features = [
  {
    path: '/test/v1/auth',
    title: 'Đăng nhập bằng ví',
    desc: 'Kết nối ví, đăng nhập hệ thống bằng MetaMask hoặc Solana.',
  },
  {
    path: '/test/v1/products',
    title: 'Xem danh sách sản phẩm (Offers)',
    desc: 'Xem, tìm kiếm, lọc, sắp xếp các sản phẩm/token đang niêm yết.',
  },
  {
    path: '/test/v1/wallets-deposit-test',
    title: 'Nạp tiền test vào ví',
    desc: 'Chọn token và nạp tiền test vào ví của bạn để thử mua bán.',
  },
];

export default function V1TestMenu() {
  return (
    <div className="min-h-[80vh] bg-[#10141c] flex flex-col items-center py-16">
      <h1 className="text-3xl font-bold text-blue-400 mb-8">Menu Test Nghiệp Vụ v1</h1>
      <div className="w-full max-w-xl flex flex-col gap-6">
        {features.map((f) => (
          <Link
            key={f.path}
            href={f.path}
            className="block bg-[#181e2a] border border-[#232a3a] rounded-xl p-6 shadow hover:shadow-lg transition group"
          >
            <div className="text-xl font-semibold text-white group-hover:text-blue-400 mb-1">
              {f.title}
            </div>
            <div className="text-gray-400 text-sm">{f.desc}</div>
            <div className="mt-2 text-xs text-blue-300">{f.path}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
