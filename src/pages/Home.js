import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
// import { faTimes } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [found, setFound] = useState(false);
  const [jumlahPeserta, setJumlahPeserta] = useState(0);
  const [loading, setLoading] = useState(false);

  const [fakultasList, setFakultasList] = useState([]);
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const [namaFakultas, setNamaFakultas] = useState('');
  const [prodiList, setProdiList] = useState([]);
  const [selectedProdi, setSelectedProdi] = useState('');
  const [selectedGelombang, setSelectedGelombang] = useState('');

  const apiUrl1 = process.env.REACT_APP_API_URL_1;
  const apiUrl2 = process.env.REACT_APP_API_URL_2;
  const apiUrl3 = process.env.REACT_APP_API_URL_3;
  const apiUrl4 = process.env.REACT_APP_API_URL_4;

  useEffect(() => {
    // Memuat daftar fakultas saat komponen pertama kali dimuat
    fetchFakultasList();
  }, []);

  const fetchFakultasList = async () => {
    try {
      const response = await axios.get('http://localhost:8001/fakultas');
      setFakultasList(response.data);
    } catch (error) {
      console.error('Error fetching fakultas:', error);
    }
  };

  const handleFakultasChange = async (event) => {
    const idFakultas = event.target.value;
    setSelectedFakultas(idFakultas);
    setFound(false);
    setSelectedProdi('');

    if (idFakultas === "1") {
      setNamaFakultas('Fakultas Hukum');
    } else if (idFakultas === "2") {
      setNamaFakultas('Fakultas Ilmu Sosial dan Ilmu Politik');
    } else if (idFakultas === "3") {
      setNamaFakultas('Fakultas Teknik');
    } else if (idFakultas === "4") {
      setNamaFakultas('Fakultas Ekonomi dan Bisnis');
    } else if (idFakultas === "5") {
      setNamaFakultas('Fakultas Keguruan dan Ilmu Pendidikan');
    } else if (idFakultas === "6") {
      setNamaFakultas('Fakultas Ilmu Seni dan Sastra');
    } else {
      setNamaFakultas('');
    }

    if (idFakultas === '') {
      setProdiList([]);
      setSelectedProdi('');
      setFound(false);
    } else {
      try {
        const response = await axios.get(`http://localhost:8001/prodi/${idFakultas}`);
        setProdiList(response.data);
      } catch (error) {
        console.error('Error fetching prodi:', error);
      }
    }
  };

  const handleProdiChange = (e) => {
    setSelectedProdi(e.target.value);
    setFound(false);
  };

  const handleGelombangChange = (e) => {
    setSelectedGelombang(e.target.value);
    setFound(false);
    setSelectedFakultas('');
    setSelectedProdi('');
  };

  const handleSearchClick = async () => {
    try {
      if (!selectedProdi) {
        Swal.fire({
          title: 'PROGRAM STUDI TIDAK BOLEH KOSONG!',
          text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
          imageUrl: 'logo_new.png',
          imageHeight: 100,
          imageAlt: 'Logo',
          confirmButtonColor: '#0d6efd'
        });
        return;
      }

      setLoading(true);
      const response = await axios.post(apiUrl1, { programStudi: selectedProdi });
      const responseData = response.data;

      if (responseData.found) {
        setJumlahPeserta(responseData.jumlah);
        setFound(true);
        setLoading(false);
      } else {
        setLoading(false);
        setFound(false);
        Swal.fire({
          title: 'PROGRAM STUDI TIDAK TERDAFTAR!',
          text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
          imageUrl: 'logo_new.png',
          imageHeight: 100,
          imageAlt: 'Logo',
          confirmButtonColor: '#0d6efd'
        });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setFound(false);
      Swal.fire({
        title: 'TERJADI KESALAHAN SAAT MENGAMBIL DATA!',
        text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
        imageUrl: 'logo_wisuda.png',
        imageHeight: 100,
        imageAlt: 'Logo',
        confirmButtonColor: '#0d6efd'
      });
    }
  };

  const handleDownloadClick = async () => {
    try {
      const response = await axios.post(apiUrl2, { programStudi: selectedProdi, fakultas: selectedFakultas, gelombang: selectedGelombang }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `REKAPITULASI_NILAI_${selectedProdi}.pdf`);
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      link.remove();

      Swal.fire({
        title: `REKAPITULASI NILAI ${selectedProdi} BERHASIL DIUNDUH!`,
        text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
        imageUrl: 'logo_new.png',
        imageHeight: 100,
        imageAlt: 'Logo',
        confirmButtonColor: '#0d6efd'
      });

      setFound(false)

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'TERJADI KESALAHAN SAAT MENGUNDUH LAPORAN!',
        text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
        imageUrl: 'logo_new.png',
        imageHeight: 100,
        imageAlt: 'Logo',
        confirmButtonColor: '#0d6efd'
      });
    }
  };

  const handleDownloadEstimasiDP = async () => {
    try {
      const response = await axios.post(apiUrl3, { fakultas: selectedFakultas, gelombang: selectedGelombang }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ESTIMASI_DP_${namaFakultas}.pdf`);
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      link.remove();

      Swal.fire({
        title: `ESTIMASI DP ${namaFakultas} BERHASIL DIUNDUH!`,
        text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
        imageUrl: 'logo_new.png',
        imageHeight: 100,
        imageAlt: 'Logo',
        confirmButtonColor: '#0d6efd'
      });

      setFound(false)

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'TERJADI KESALAHAN SAAT MENGUNDUH LAPORAN!',
        text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
        imageUrl: 'logo_new.png',
        imageHeight: 100,
        imageAlt: 'Logo',
        confirmButtonColor: '#0d6efd'
      });
    }
  };

  const handleDownloadDistribusiNilai = async () => {
    try {
      const response = await axios.post(apiUrl4, { programStudi: selectedProdi, fakultas: selectedFakultas, gelombang: selectedGelombang }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DISTRIBUSI_NILAI_${selectedProdi}.pdf`);
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      link.remove();

      Swal.fire({
        title: `DISTRIBUSI NILAI ${selectedProdi} BERHASIL DIUNDUH!`,
        text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
        imageUrl: 'logo_new.png',
        imageHeight: 100,
        imageAlt: 'Logo',
        confirmButtonColor: '#0d6efd'
      });

      setFound(false)

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'TERJADI KESALAHAN SAAT MENGUNDUH LAPORAN!',
        text: 'PANITIA PMB UNIVERSITAS PASUNDAN TAHUN AKADEMIK 2024/2025',
        imageUrl: 'logo_new.png',
        imageHeight: 100,
        imageAlt: 'Logo',
        confirmButtonColor: '#0d6efd'
      });
    }
  };

  return (
    <>
      {/* <video className="bg-video" autoPlay muted loop>
        <source src="video.webm" type="video/mp4"/>
      </video>

      <video className="bg-video2" autoPlay muted loop>
        <source src="mobile2.webm" type="video/mp4"/>
      </video> */}
      <div className='container-fluid' style={{ textAlign: 'center' }}>
        <div className='row' style={{ textAlign: "center" }}>
          <div className='col-lg-12'>
            <img src='logo_new.png' className="img-fluid" alt='' style={{ width: '259px', height: '100px', marginBottom: '40px', marginTop: '25px' }} />
          </div>
          <div className='col-lg-12' style={{ display: "flex", justifyContent: "center" }}>
            <p className='font-color-title' style={{ marginBottom: '-2px', fontWeight: 900, background: "black", borderRadius: "10px", padding: "15px" }}>LAPORAN CLEARING HOUSE USM UNIVERSITAS PASUNDAN</p>
          </div>
        </div>

        <div className='row'>
          <div className='col' style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="input-group mb-3" style={{ width: '340px', marginTop: '30px' }}>
              <select value={selectedGelombang} onChange={handleGelombangChange} className="form-select" aria-label="Default select example">
                <option value="">-- Pilih Gelombang --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col' style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="input-group mb-3" style={{ width: '340px', marginTop: '10px' }}>
              <select value={selectedFakultas} onChange={handleFakultasChange} className="form-select" aria-label="Default select example" disabled={selectedGelombang === ''}>
                <option value="">-- Pilih Fakultas --</option>
                {fakultasList.map((fakultas) => (
                  <option key={fakultas.id} value={fakultas.id}>
                    {fakultas.namaFakultas}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col' style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="input-group mb-3" style={{ width: '340px', marginTop: '10px' }}>
              <select value={selectedProdi} onChange={handleProdiChange} className="form-select" aria-label="Default select example" disabled={selectedFakultas === ''}>
                <option value="">-- Pilih Program Studi --</option>
                {prodiList.map((prodi) => (
                  <option key={prodi.id} value={prodi.namaProdi}>
                    {prodi.namaProdi}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col' style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '340px', marginTop: '10px' }}>
              <button type="button" className="btn btn-info" style={{ width: "100%", marginBottom: "20px" }} disabled={selectedProdi === ''} onClick={handleSearchClick}>Cek Jumlah Peserta Per Prodi</button>
            </div>
          </div>
        </div>

        <div className='row' style={{ marginBottom: "0px" }}>
          <div className='col-lg-12' style={{ display: 'flex', justifyContent: 'center' }}>
            {loading ? (
              <div className="d-flex justify-content-center">
                <button className="btn btn-dark" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span role="status"> Loading...</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>


        {found &&
          <h6>{selectedProdi}: <span className="badge text-bg-success">{jumlahPeserta}</span></h6>
        }

        <div className='row'>
          <div className='col' style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '340px', marginTop: '10px' }}>
              <button type="button" className="btn btn-success" style={{ width: "100%", marginTop: "10px" }} disabled={selectedProdi === ''} onClick={handleDownloadClick}>Download Rekapitulasi Nilai</button>
              <button type="button" className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }} disabled={selectedProdi === ''} onClick={handleDownloadDistribusiNilai}>Download Distribusi Nilai Tes</button>
              <button type="button" className="btn btn-warning" style={{ width: "100%", marginTop: "10px" }} disabled={selectedFakultas === ''} onClick={handleDownloadEstimasiDP}>Download Estimasi Pendapatan DP</button>
              <button type="button" className="btn btn-danger" style={{ width: "100%", marginTop: "10px", marginBottom: "50px" }} disabled={selectedFakultas === ''}>Download Berita Acara</button>
            </div>
          </div>
        </div>

      </div> {/*end div container*/}

      <footer>
        <span className="website" style={{ fontSize: '12px' }}>
          &copy; 2024&nbsp;<b><a href="https://www.unpas.ac.id/" target="_blank" rel="noreferrer">
            Universitas Pasundan
          </a></b>&nbsp;-&nbsp;
          <b><a href="https://sptik.unpas.ac.id/" target="_blank" rel="noreferrer">
            LP2TIK
          </a></b>&nbsp;-&nbsp;
          <span>
            All Rights Reserved&nbsp;-&nbsp;
          </span>
          <b><a href="https://www.unpas.ac.id/?page_id=58414" target="_blank" rel="noreferrer">
            Privacy and Copyright
          </a></b>
          <b> - Made with <span style={{ color: 'red' }}>❤</span>
          </b>
        </span>

        <br />

        <span className="sosial-media">
          <a href="https://www.instagram.com/univ_pasundan/" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faInstagram} style={{ marginRight: '5px' }} />
            univ_pasundan
          </a>
          <a href="https://web.facebook.com/universitaspasundan" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faFacebook} style={{ marginRight: '5px' }} />
            Universitas Pasundan
          </a>
          <a href="https://twitter.com/univ_pasundan" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faTwitter} style={{ marginRight: '5px' }} />
            @univ_pasundan
          </a>
          <a href="https://www.tiktok.com/@univ_pasundan" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faTiktok} style={{ marginRight: '5px' }} />
            univ_pasundan
          </a>
          <a href="https://www.youtube.com/c/UniversitasPasundanOfficial" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faYoutube} style={{ marginRight: '5px' }} />
            Universitas Pasundan Official
          </a>
        </span>
      </footer>

    </>
  );
}

export default App;
