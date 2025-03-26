const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const dataPlaylist = $(".playlist")
const heading = $("header h3");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const btnplay = $(".btn-toggle-play")
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const dashboard = $('.dashboard')
const toggleDarkMode = $(".dark-mode-toggle");

const app = {
    songsIndex: 0,
    isPlaying: true,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Sự Nghiệp Chướng",
            singer: "Pháo",
            path: "/MusicPlayer/assets/music/Sự nghiệp Chướng.mp3",
            image: "/MusicPlayer/assets/img/playlist/SuNghiepChuong.jpg",
        },
        {
            name: "Tệ Thật Anh Nhớ Em",
            singer: "Thanh Hưng",
            path: "/MusicPlayer/assets/music/Tệ Thật, Anh Nhớ Em  Thanh Hưng  Piano cover  Nguyenn.mp3",
            image: "/MusicPlayer/assets/img/playlist/TeThatAnhNhoEm.jpg",
        },
        {
            name: "Sẽ Có Người Tốt Hơn",
            singer: "Min.T",
            path: "/MusicPlayer/assets/music//Sẽ Có Người Tốt Hơn Min.T  Piano cover Nguyenn.mp3",
            image: "/MusicPlayer/assets/img/playlist/Sẽ Có Người Tốt Hơn.jpg",
        },
        {
            name: "Đoạn Kết Cuối",
            singer: "Vũ Thịnh - FANNY",
            path: "/MusicPlayer/assets/music/ĐOẠN KẾT CUỐI - VŨ THỊNH (FT. FANNY)  PIANO COVER  NGUYENN.mp3",
            image: "/MusicPlayer/assets/img/playlist/DoanKetCuoi.jpg",
        },
        {
            name: "Tình Yêu Chậm Trễ",
            singer: "MONSTAR",
            path: "/MusicPlayer/assets/music/MONSTAR - TÌNH YÊU CHẬM TRỄ  PIANO COVER  NGUYENN.mp3",
            image: "/MusicPlayer/assets/img/playlist/TÌNH YÊU CHẬM TRỄ.jpg",
        },
        {
            name: "Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau",
            singer: "O.LEW",
            path: "/MusicPlayer/assets/music/RỒI TA SẼ NGẮM PHÁO HOA CÙNG NHAU  Olew  Piano cover  Nguyenn ft Hiền Hiền ( Hợp âm).mp3",
            image: "/MusicPlayer/assets/img/playlist/Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau.jpg",
        },
        {
            name: "Thích một người",
            singer: "TrungIU",
            path: "/MusicPlayer/assets/music/Trungg I.U - 'THÍCH MỘT NGƯỜI' l Piano cover l Nguyenn.mp3",
            image: "/MusicPlayer/assets/img/playlist/Thích Một Người.jpg",
        },
        {
            name: "Chẳng Thể Cùng Em",
            singer: "Quockiet feat. Khiem",
            path: "/MusicPlayer/assets/music/Chẳng Thể Cùng Em  Quockiet feat. Khiem  Nguyenn x @aric1407 I Piano cover.mp3",
            image: "/MusicPlayer/assets/img/playlist/Chẳng Thể Cùng Em.jpg",
        },
        {
            name: "Chúng Ta Chỉ Giống Tình Yêu",
            singer: "Hoàng Green",
            path: "/MusicPlayer/assets/music/CHÚNG TA CHỈ GIỐNG TÌNH YÊU - HOÀNG GREEN  NGUYENN x ARIC PIANO COVER.mp3",
            image: "/MusicPlayer/assets/img/playlist/Chúng Ta Chỉ Giống Tình Yêu.jpg",
        },
        {
            name: "Một Người Đánh Mất Một Người",
            singer: "Olew",
            path: "/MusicPlayer/assets/music/O.LEW - MỘT NGƯỜI ĐÁNH MẤT MỘT NGƯỜI  PIANO COVER  NGUYENN.mp3",
            image: "/MusicPlayer/assets/img/playlist/Một Người Đánh Mất Một Người.jpg",
        },
        {
            name: "Tôi Gặp Em Vào Mùa Hạ",
            singer: "Việt Anh",
            path: "/MusicPlayer/assets/music/TÔI GẶP EM VÀO MÙA HẠ - VIỆT ANH  NGUYENN PIANO COVER.mp3",
            image: "/MusicPlayer/assets/img/playlist/Tôi Gặp Em Vào Mùa Hạ.jpg",
        },
    ],
    //---------- 0. Trả về dữ liệu mới theo mảng songs
    render: function () { //
        const htmls = this.songs.map((song, index) => {
            return `
          <div class="song ${index === this.songsIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style=" background-image: url('${song.image}');"></div>           
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="btn-favorite" data-index="0">
            <i class="far fa-heart"></i>
          </div>
          </div>`
        });
        dataPlaylist.innerHTML = htmls.join("\n");
    },

    //--------------- 1. Định nghĩa thuộc tính để lấy dữ liệu bài hát hiện tại
    defineProperties: function () {
        // Sử dụng Object.defineProperty để thêm hoặc chỉnh sửa một thuộc tính
        Object.defineProperty(this, "getSongs", {
            // Getter để đọc và lấy dữ liệu bài hát hiện tại
            get: function () {
                return this.songs[this.songsIndex]; // Trả về dữ liệu bài hát tại vị trí 'songsIndex' trong mảng songs
            },
        });
    },

    //------------------------- 2. Tải dữ liệu bài hát hiện tại lên giao diện
    loadSongs: function () {
        // Cập nhật tiêu đề bài hát
        heading.textContent = this.getSongs.name;
        // Cập nhật hình ảnh thumbnail của bài hát
        cdThumb.style.backgroundImage = `url('${this.getSongs.image}')`;
        // Cập nhật đường dẫn file nhạc cho audio
        audio.src = this.getSongs.path;
        app.render() // Nếu cần, có thể render lại danh sách bài hát sau khi tải dữ liệu
    },

    //------------------------- Next nhạc
    nextSongs: function () {
        this.songsIndex++
        if (this.songsIndex >= this.songs.length) {
            this.songsIndex = 0
        }
        this.loadSongs()
        this.scrollToActive()
    },

    //------------------------- Prev nhạc
    prevSongs: function () {
        this.songsIndex--
        if (this.songsIndex < 0) {
            this.songsIndex = this.songs.length - 1
        }
        this.loadSongs()
        this.scrollToActive()
    },

    //------------------------- Random nhạc
    randomSongs: function () {
        let newSongsIndex
        do {
            newSongsIndex = Math.floor(Math.random() * this.songs.length)
        } while (newSongsIndex === this.songsIndex);
        this.songsIndex = newSongsIndex
        app.loadSongs()
    },

    scrollToActive: function () {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })
    },

    //------------------------- Listener Event ----------------------------------------
    hendleEvents: function () {
        //zoom cd-thuhmb
        const newCd = cd.offsetWidth; // get width value

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const setWidth = newCd - scrollTop;
            let marginTop = dashboard.style.marginTop;
            
            if (setWidth > 0) {
                marginTop = 20 + 'px';
            } else {
                marginTop = 0 + 'px';
            }
            dashboard.style.marginTop = marginTop;

            cd.style.width = setWidth > 0 ? setWidth + "px" : "0px";
            // //làm mờ cd
            cd.style.opacity = setWidth / newCd;
        }

        //lắng nghe và xử lý play + pause
        btnplay.onclick = function () {
            //nếu isPlaying = false (ko chạy)
            if (btnplay.isPlaying) {
                audio.pause()
            }
            //nếu isPlaying = true (đang chạy)
            else {
                audio.play()
            }
        }

        //audio chạy
        audio.onplay = function () {
            btnplay.isPlaying = true
            $(".player").classList.add("playing");
            cdThumbAnimate.play()
        }
        //audio dừng
        audio.onpause = function () {
            btnplay.isPlaying = false
            $(".player").classList.remove("playing");
            cdThumbAnimate.pause()
        }

        //Cập nhật thanh progress theo thời gian chạy của nhạc (ontimeupdate).
        audio.ontimeupdate = function () {
            if (this.duration && !isNaN(this.duration)) {
                const progressPercent = (this.currentTime / this.duration) * 100
                progress.value = progressPercent // phần trăm hiện tại (1->100)               
            }
        }

        //Tua nhạc khi người dùng thay đổi giá trị thanh progress (onchange).
        progress.oninput = function (e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        //CD Rotate
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 5000, //seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Next Songs
        btnNext.onclick = function () {
            if (app.isRandom) {
                app.randomSongs()
            } else {
                app.nextSongs()
            }
            audio.play()
        }

        //Prev Songs
        btnPrev.onclick = function () {
            if (app.isRandom) {
                app.randomSongs()
            } else {
                app.prevSongs()
            }
            audio.play()
        }

        //Random Songs
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom
            this.classList.toggle('active', app.isRandom) //this mặc định là phần tử DOM kích hoạt sự kiện
        }

        //------------------------- Repeat Songs
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat
            this.classList.toggle('active', app.isRepeat) //this mặc định là phần tử DOM kích hoạt sự kiện
        }

        //Ra lệnh ... khi hết nhạc (onended)
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
        }

        //Xử lý khi click bài hát
        dataPlaylist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode) {
                app.songsIndex = Number(songNode.dataset.index)
                app.loadSongs()
                audio.play()
                app.render()
            }
        }

        //
        toggleDarkMode.onclick = function () {
            document.body.classList.toggle('dark-mode')
        }

    },
    start: function () {
        this.render();
        this.defineProperties();
        this.loadSongs();
        this.hendleEvents();
    },
};
app.start();
