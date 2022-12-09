import React from 'react';

const Sidebar = props => {
    const [data, setData] = React.useState([]);
    const getData = React.useCallback(async () => {
        await fetch(`/new.json`)
            .then(response => response.json())
            .then(data => setData([...data]));
    }, [])
    React.useEffect(() => {
        getData()
    }, [getData])
    return (
        <div className={`left-side`}>
            <div className="side-wrapper sideMenu">
                <div className="side-title">Noticias 📰</div>
                <div className="caja-info">
                    {data.map((row, index) => (
                        <div className={`content-form`} key={index}>
                            <img src={row.urlToImage} alt='' />
                            <div className='text-news'>
                                <a href={row.url}>{row.title}</a>
                                <p>{row.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
