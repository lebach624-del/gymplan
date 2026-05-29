function KetQua({ ketQua, loading }) {
    return (
        <>
            {loading && <p className="loading">⏳ Đang tạo lịch tập...</p>}
            {ketQua && (
                <div className="ketqua" dangerouslySetInnerHTML={{
                    __html: ketQua
                        .replace(/## (.*?)(\n|$)/g, "<h2 style='text-align:center;font-size:20px;color:#00d4a0;margin:24px 0 12px'>$1</h2>")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
                        .replace(/\n/g, "<br>")
                }} />
            )}
        </>
    )
}

export default KetQua