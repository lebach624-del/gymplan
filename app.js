// ========================
// VGYM PLAN – APP.JS
// ========================

// ---- Thay API key của bạn vào đây (chỉ admin chỉnh) ----
const API_KEY = "AIzaSyAyGDU7nclcWl4CmMaq-x31Tuu1w01DibY";

// -------- State --------
let selectedGoal = "Tăng cơ";
let selectedDays = "4 ngày";
let selectedLevel = "Trung bình";

// -------- Selectors --------
function selectGoal(el) {
    document.querySelectorAll(".goal-card").forEach(c => c.classList.remove("selected"));
    el.classList.add("selected");
    selectedGoal = el.dataset.value;
}

function selectDays(el) {
    document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("selected"));
    el.classList.add("selected");
    selectedDays = el.dataset.value;
}

function selectLevel(el) {
    document.querySelectorAll(".level-card").forEach(c => c.classList.remove("selected"));
    el.classList.add("selected");
    selectedLevel = el.dataset.value;
}

// -------- Render markdown -> HTML --------
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
        .replace(/## (.*?)(\n|$)/g, "<h3>$1</h3>")
        .replace(/# (.*?)(\n|$)/g, "<h3>$1</h3>")
        .replace(/\n/g, "<br>");
}

function hienThi(text) {
    document.getElementById("ketqua").innerHTML = renderMarkdown(text);
}

// -------- Show/hide cards --------
function showCard(id) { document.getElementById(id).style.display = ""; }
function hideCard(id) { document.getElementById(id).style.display = "none"; }
function blockCard(id) { document.getElementById(id).style.display = "block"; }

// -------- Load on page load --------
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("lichTap");
    const savedMeta = localStorage.getItem("lichTapMeta");
    if (saved) {
        hienThi(saved);
        if (savedMeta) document.getElementById("resultMeta").textContent = savedMeta;
        blockCard("resultCard");
    }
    renderHistory();
});

// -------- Render history --------
function renderHistory() {
    const lichSu = JSON.parse(localStorage.getItem("lichSu")) || [];
    const historyCard = document.getElementById("historyCard");
    const container = document.getElementById("lichsu");

    if (lichSu.length === 0) { hideCard("historyCard"); return; }

    blockCard("historyCard");
    container.innerHTML = "";

    [...lichSu].reverse().forEach((item) => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <div class="history-item-dot"></div>
            <span>
                ${item.gender || ""} · ${item.tuoi} tuổi · ${item.canNang}kg · ${item.chieuCao}cm ·
                <strong style="color:var(--accent)">${item.mucTieu}</strong> ·
                <em style="color:var(--accent-2)">${item.capDo || ""}</em> ·
                ${item.soNgay}
                <span style="color:var(--text-muted);font-size:11px;margin-left:6px;">${item.time || ""}</span>
            </span>
        `;
        container.appendChild(div);
    });
}

// -------- Clear history --------
function clearHistory() {
    localStorage.removeItem("lichSu");
    renderHistory();
}

// -------- Copy result --------
function copyResult() {
    const text = document.getElementById("ketqua").innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("btnCopy");
        const original = btn.innerHTML;
        btn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Đã sao chép!</span>`;
        btn.style.borderColor = "var(--accent)";
        btn.style.color = "var(--accent)";
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.borderColor = "";
            btn.style.color = "";
        }, 2200);
    });
}

// -------- Save PDF --------
function savePDF() {
    window.print();
}

// -------- Validation error --------
function showValidationError(msg) {
    const errorId = "validationMsg";
    let el = document.getElementById(errorId);
    if (!el) {
        el = document.createElement("div");
        el.id = errorId;
        el.style.cssText = `
            margin-top: 12px;
            padding: 12px 16px;
            background: rgba(255,60,60,0.1);
            border: 1px solid rgba(255,60,60,0.3);
            border-radius: 10px;
            color: #ff8080;
            font-size: 13px;
            font-weight: 500;
        `;
        document.getElementById("btn").insertAdjacentElement("afterend", el);
    }
    el.textContent = "⚠️ " + msg;
    setTimeout(() => el?.remove(), 3500);
}

// -------- Main generate function --------
async function taoLichTap() {
    const tuoi = document.getElementById("age").value.trim();
    const canNang = document.getElementById("weight").value.trim();
    const chieuCao = document.getElementById("height").value.trim();
    const gender = document.getElementById("gender").value;

    // Validation
    if (!tuoi || !canNang || !chieuCao) {
        showValidationError("Vui lòng nhập đầy đủ tuổi, cân nặng và chiều cao!"); return;
    }
    if (Number(tuoi) < 10 || Number(tuoi) > 80) {
        showValidationError("Tuổi hợp lệ từ 10 đến 80."); return;
    }
    if (Number(canNang) < 30 || Number(canNang) > 200) {
        showValidationError("Cân nặng hợp lệ từ 30 đến 200 kg."); return;
    }
    if (Number(chieuCao) < 100 || Number(chieuCao) > 250) {
        showValidationError("Chiều cao hợp lệ từ 100 đến 250 cm."); return;
    }

    // UI state
    hideCard("resultCard");
    blockCard("loadingCard");
    const btn = document.getElementById("btn");
    btn.disabled = true;
    document.querySelector(".btn-text").textContent = "Đang tạo lịch tập...";

    // Tính BMI
    const bmi = (Number(canNang) / Math.pow(Number(chieuCao) / 100, 2)).toFixed(1);
    const bmiNote = bmi < 18.5 ? "Gầy" : bmi < 25 ? "Bình thường" : bmi < 30 ? "Thừa cân" : "Béo phì";

    // Build prompt
    const prompt =
        `Tạo lịch tập gym chi tiết và chuyên nghiệp cho:\n` +
        `- Giới tính: ${gender}\n` +
        `- Tuổi: ${tuoi} tuổi\n` +
        `- Cân nặng: ${canNang} kg, Chiều cao: ${chieuCao} cm\n` +
        `- BMI: ${bmi} (${bmiNote})\n` +
        `- Mục tiêu: ${selectedGoal}\n` +
        `- Cấp độ thể lực: ${selectedLevel}\n` +
        `- Số ngày tập: ${selectedDays}/tuần\n\n` +
        `Yêu cầu:\n` +
        `1. Liệt kê lịch tập từng ngày cụ thể trong tuần\n` +
        `2. Mỗi ngày gồm 4–5 bài tập kèm số sets/reps và thời gian nghỉ\n` +
        `3. Điều chỉnh cường độ phù hợp với cấp độ "${selectedLevel}"\n` +
        `4. Cuối cùng, thêm mục "Lời khuyên dinh dưỡng" với 3–4 gợi ý ngắn gọn\n` +
        `Định dạng rõ ràng, dễ đọc, dùng tiếng Việt.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("Không nhận được phản hồi từ AI. Vui lòng thử lại.");
        }

        const ketQua = data.candidates[0].content.parts[0].text;
        const metaText = `${gender} · ${tuoi} tuổi · ${canNang}kg · BMI ${bmi} · ${selectedGoal} · ${selectedLevel} · ${selectedDays}`;

        // Save
        localStorage.setItem("lichTap", ketQua);
        localStorage.setItem("lichTapMeta", metaText);

        const lichSu = JSON.parse(localStorage.getItem("lichSu")) || [];
        lichSu.push({
            gender, tuoi, canNang, chieuCao,
            mucTieu: selectedGoal,
            capDo: selectedLevel,
            soNgay: selectedDays,
            time: new Date().toLocaleString("vi-VN")
        });
        localStorage.setItem("lichSu", JSON.stringify(lichSu));

        // Show result
        hideCard("loadingCard");
        document.getElementById("resultMeta").textContent = metaText;
        hienThi(ketQua);
        blockCard("resultCard");
        document.getElementById("resultCard").scrollIntoView({ behavior: "smooth", block: "start" });
        renderHistory();

    } catch (err) {
        hideCard("loadingCard");
        document.getElementById("resultMeta").textContent = "";
        document.getElementById("ketqua").innerHTML =
            `<div style="color:#ff6464;font-weight:600;">&#9888;&#65039; ${err.message}</div>`;
        blockCard("resultCard");
    } finally {
        btn.disabled = false;
        document.querySelector(".btn-text").textContent = "Tạo lịch tập ngay";
    }
}