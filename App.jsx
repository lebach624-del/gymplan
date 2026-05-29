import { useState } from 'react'

function App() {
  const [tuoi, setTuoi] = useState('')
  const [canNang, setCanNang] = useState('')
  const [mucTieu, setMucTieu] = useState('Tăng cơ')
  const [chieuCao, setChieuCao] = useState('')
  const [soNgay, setSoNgay] = useState('3 ngày')
  const taoLichTap = async () => {
    if (!tuoi || !canNang || !chieuCao) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    alert("Tuổi: " + tuoi + " — Cân nặng: " + canNang + "kg");
  }
  return (
    <div>
      <h1>Tạo lịch tập</h1>

      <label>Tuổi</label>
      <input
        type="number"
        value={tuoi}
        onChange={(e) => setTuoi(e.target.value)}
        placeholder="25"
      />

      <label>Cân nặng (kg)</label>
      <input
        type="number"
        value={canNang}
        onChange={(e) => setCanNang(e.target.value)}
        placeholder="70"
      />

      <label>Chiều cao (Cm)</label>
      <input
        type="number"
        value={chieuCao}
        onChange={(e) => setChieuCao(e.target.value)}
        placeholders="175"
      ></input>

      <label>Mục Tiêu</label>
      <select value={mucTieu} onChange={(e) => setMucTieu(e.target.value)}>
        <option>Tăng cơ</option>
        <option>Giảm mỡ</option>
        <option>Tăng cơ/Giảm mỡ</option>
        <option>Tăng sức bền</option>
      </select>

      <label> Số ngày tập/tuần</label>
      <select value={soNgay} onChange={(e) => setSoNgay(e.target.value)}>
        <option>3 ngày</option>
        <option>4 ngày</option>
        <option>5 ngày</option>
      </select>

      <button onclick={() => taoLichTap()}>Tạo lịch tập</button>
      <p>Tuổi: {tuoi} — Cân nặng: {canNang}kg — Chiều cao:{chieuCao}Cm</p>
    </div>
  )
}

export default App