/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import QRCodeStyling from 'qr-code-styling';
import { db } from '../firebase/firebase';
import { Loading } from './proyect';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const Detalle = props => {
    const [data, setData] = React.useState([]);
    const [isActive, setisActive] = React.useState('is-active');
    const [chart, setChart] = React.useState({
        label: [0, 0, 0, 0],
        datasets: [
            {
                fill: true,
                label: 'Actividad de escaneo QR',
                data: [0, 0, 0, 0],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });
    const { id } = useParams();
    const VcardDataColletion = doc(db, "VcardData", id);
    React.useEffect(() => {
        document.querySelector('.left-side').style.display = 'none';
    })
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Actividad de escaneo QR',
            },
        },
    };

    const getData = async () => {
        await getDoc(VcardDataColletion).then((res) => {
            setData(res.data());
            var qrCode = new QRCodeStyling(res.data().QRdata);
            qrCode.update({ width: 100, height: 100 });
            qrCode.append(document.getElementById('qrdetail'));
            const dataC = [
                ...res.data()?.stadistic?.movil?.map((x) => (x.escaneo)),
                ...res.data()?.stadistic?.web?.map((x) => (x.escaneo))
            ];
            const labels = [
                ...res.data()?.stadistic?.movil?.map((x) => (x.fecha)),
                ...res.data()?.stadistic?.web?.map((x) => (x.fecha))
            ];
            setChart({
                labels,
                datasets: [
                    {
                        fill: true,
                        label: 'Fecha',
                        data: dataC,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            });
        }).then(() => {
            setisActive('');
        })
    };
    const movil = parseFloat(data.stadistic?.movil?.map((x) => x.escaneo).reduce((prev, curr) => prev + curr));
    const web = parseFloat(data.stadistic?.web?.map((x) => x.escaneo).reduce((prev, curr) => prev + curr));
    const escaneo = movil + web;
    React.useEffect(() => {
        getData();
    }, [])
    return (
        <div className="main-container">
            <div className="main-header">
                <a className="menu-link-main" href="#sa">Detalle del Proyectos</a>
            </div>
            <div className={`content-wrapper`}>
                <div className='iphone detalle'>
                    <div className='nEscaneo'>
                        <h2>{escaneo}</h2>
                        <h4>{escaneo === 0 ? `Ningun escaneo` : `Total Escaneos`}</h4>
                    </div>
                    <div className='escaneo'></div>
                    <div className='infoD'>
                        <span><i className="fa-solid fa-desktop"></i> <h4>{web === 0 ? 'Ningun PC a escaneado' : `Computadora o Laptos: ${web}`} </h4></span>
                        <span><i className="fa-solid fa-mobile-screen-button"></i><h4>{movil === 0 ? 'Ningun celular a escaneado' : `Celulares Inteligentes: ${movil}`}</h4></span>
                    </div>
                    <div className='box_QR'>
                        <div className='QRDetaill' id='qrdetail'></div>
                    </div>
                </div>
                <div className='content-section'>
                    <div className='iphone barchar'>
                        <div className="header">
                            <h3 className="header-menu">Actividades de Escaneo 📊</h3>
                        </div>
                        <div className='graficpt'>
                            <Line options={options} data={chart} />
                        </div>
                    </div>
                </div>
                <Loading isActive={isActive} />
            </div>
        </div>
    );
};

export default Detalle;