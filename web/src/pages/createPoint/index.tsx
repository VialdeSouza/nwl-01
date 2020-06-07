import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiArrowLeft } from 'react-icons/fi';
import Dropzone from '../../components/Dropzone'

import axios from 'axios';
import api from '../../services/api';

import './style.css';
import logo from '../../assets/logo.svg';

interface Item {
    id: number;
    title: string;
    image_url: string;
}
interface IBGEUFResponse {
    sigla: string;
}
interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    const history = useHistory();

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUF, setSelectedUF] = useState('0');
    const [citys, setCitys] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('0');
    const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedPosition, setselectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })

    }, []);
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const UfInitials = response.data.map(uf => uf.sigla);
                setUfs(UfInitials);
            });
    }, []);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setinitialPosition([latitude, longitude]);
        })
    }, [])
    useEffect(() => {
        if (selectedUF === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);
                setCitys(cityNames);
            });

    }, [selectedUF])


    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const UF = event.target.value;
        setSelectedUF(UF);
    }
    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        setSelectedCity(city);
    }
    function handleMapClick(event: LeafletMouseEvent) {
        setselectedPosition([event.latlng.lat, event.latlng.lng]);
    }
    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if (alreadySelected >= 0) {
            const filterItems = selectedItems.filter(item => item !==id);
            setSelectedItems(filterItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }
    function handleSubmit(event: FormEvent){
        event.preventDefault();
     
        const {name, email, whatsapp} = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData()

       data.append('name',name);
       data.append('email',email);
       data.append('whatsapp',whatsapp);
       data.append('uf',uf);
       data.append('city',city);
       data.append('latitude', String(latitude));
       data.append('longitude', String(longitude));
       data.append('items', items.join(','));
       if(selectedFile){
           data.append('image', selectedFile);
       }


        api.post('points', data).then(()=> {
            alert('Cadastro realizado');
            history.push('/');
        }).catch(()=>{
            alert('Ocorreu um erro');
        })

      
    }
    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="" />
                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile} />
                <fieldset>
                    <legend>
                        <h2>
                            Dados
                        </h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">
                            Nome da entidade
                        </label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name='whatsapp'
                                id='whatsapp'
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>
                            Endereço
                        </h2>
                        <span>
                            Selecione o endereço no mapa
                        </span>
                    </legend>
                    <Map center={initialPosition} zoom={15} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker

                            position={selectedPosition}
                        />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUF}
                                onChange={handleSelectUf}>
                                <option value="0">Selecione uma uf</option>
                                {ufs.map(uf =>
                                    <option value={uf} key={uf}>{uf}</option>
                                )}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {citys.map(city =>
                                    <option value={city} key={city}>{city}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>
                            Ítens de coleta
                        </h2>
                        <span>
                            Selecione um ou mais ítens abaixo
                        </span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>

    )

};
export default CreatePoint;