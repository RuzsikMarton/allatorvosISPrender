import React from "react";
import {Helmet} from "react-helmet-async";
import {Button, Container} from "react-bootstrap";
import vizsga from "../img/vizsga.png"
import diagnose from "../img/diagnose.jpg"
import chip from "../img/chip.jpg"

function HomeScreen(props) {
    const userInfo = props;
    return (
        <div>
            <Helmet><title>Állatorvos</title></Helmet>
            <div className={"info-head"}>
                <Container>
                    <div className={"info-heading-wrapper"}>
                        <h1 className={"info-heading"}><br/>Állatorvosi Rendelő</h1>
                        <p className={"info-head-para"}> Szívesen vállaljuk: kutyák, macskák, kisrágcsálók (törpe nyúl, tengeri malac, stb.) ellátását.<br/>
                            Jelenleg nem tudjuk vállalni: egzotikus állatok, lovak, szarvasmarhák, sertés, kecske, juh, házi szárnyasok, egyéb haszonállatok ellátását.
                        </p>
                    </div>
                </Container>
            </div>
            <div className={"info-main"}>
                <Container>
                    <div className={"info-main-top-wrapper"}>
                        <div className={"info-main-top-left"}>
                            <h2 className={"info-main-top-lefth2"}>SZOLGÁLTATÁSOK, AMELYEKET NYÚJTUNK:</h2>
                        </div>
                        <div className={"info-main-top-right"}>
                            <p>Megelőző orvoslás,
                                Sebészet,
                                Bőrgyógyászat,
                                Ortopédia,
                                Fogászati higiénia,
                                Kardiológia.<br/>

                                A klinika sürgősségi szolgáltatásokat nyújt hétköznapokon, hétvégén és ünnepnapokon is.</p>
                        </div>
                    </div>
                    <div className={"info-main-wrapper"}>
                        <div className={"info-main-column"}>
                            <div className={"info-main-square"}>
                                <img className={"info-square-img"} src={vizsga} alt={'Vizsgálatok'}/>
                                <div className={"image_overlay"}>
                                    <p className={"image_description"}>Vizsgálatok</p>
                                </div>
                            </div>
                            <p>
                                Vizsgálatok:
                                <ul>
                                    <li>Konzultációk</li>
                                    <li>Klinikai vizsgálatok</li>
                                    <li>Laboratóriumi vizsgálat</li>
                                </ul>
                            </p>
                        </div>
                        <div className={"info-main-column"}>
                            <div className={"info-main-square"}>
                                <img className={"info-square-img"} src={diagnose} alt={'Specializált diagnosztika'}/>
                                <div className={"image_overlay"}>
                                    <p className={"image_description"}>Specializált diagnosztika</p>
                                </div>
                            </div>
                            <p>
                                Specializált diagnosztika:
                                <ul>
                                    <li>SONOGRAFIA</li>
                                    <li>RTG</li>
                                    <li>EKG</li>
                                </ul>
                            </p>
                        </div>
                        <div className={"info-main-column"}>
                            <div className={"info-main-square"}>
                                <img className={"img-square-split"} src={chip} alt={'Oltás és chipezés'}/>
                                <div className={"image_overlay"}>
                                    <p className={"image_description"}>Oltás és chipezés</p>
                                </div>
                            </div>
                            <p>
                                Oltás és chipezés:
                                <ul>
                                    <li>Chipezés</li>
                                    <li>Oltás</li>
                                    <li>Sürgősségi szolgálat</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                    <div className={"info-main-top-wrapper mt-5"}>
                        <div className={"info-main-top-left"}>
                            <h2 className={"info-main-top-lefth2"}>TELJESKÖRŰ <br/> SZAKSZERŰSÉG</h2>
                        </div>
                        <div className={"info-main-top-right"}>
                            <p>Csapatunkat olyan orvosok alkotják, akik szakmai specializációval rendelkeznek, és folyamatosan képezik magukat, rendszeresen részt vesznek szemináriumokon és szakmai képzéseken, hogy szakmai horizontjukat kibővítsék, és innovatív megoldásokat hozzanak gyakorlatukba.</p>
                        </div>
                    </div>
                    <div className={"info-table-wrapper"}>
                        <h2 className={"text-bold text-uppercase"}>Rendelési idő</h2>
                        <table className={"table info-table"}>
                            <thead>
                            <tr>
                                <th className={"text-uppercase"}>Nap</th>
                                <th className={"text-uppercase"}>Nyitás</th>
                                <th className={"text-uppercase"}>Záras</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Hetfő</td>
                                <td>9:00</td>
                                <td>19:00</td>
                            </tr>
                            <tr>
                                <td>Kedd</td>
                                <td>9:00</td>
                                <td>19:00</td>
                            </tr>
                            <tr>
                                <td>Szerda</td>
                                <td>9:00</td>
                                <td>19:00</td>
                            </tr>
                            <tr>
                                <td>Csütörtök</td>
                                <td>9:00</td>
                                <td>19:00</td>
                            </tr>
                            <tr>
                                <td>Péntek</td>
                                <td>9:00</td>
                                <td>19:00</td>
                            </tr>
                            <tr>
                                <td>Szombat</td>
                                <td>10:00</td>
                                <td>12:00</td>
                            </tr>
                            <tr>
                                <td>Vasárnap</td>
                                <td className={'fw-bold'}>Sürgősségi ellátás csak sürgős esetekben.</td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default HomeScreen;