export function getInfoWindowContent(placeName, information, openingHours, distance) {
    return `
                <head>
                    <title>info-window</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css" rel="stylesheet">
                </head>
                <body>
                <div style="
                                padding: 10px;
                              ">
                    <style>
                        .gm-style-iw-chr {display: none;}
                        .info-window { padding: 10px; }
                        .info-header { display: flex; justify-content: space-between; align-items: center; }
                        .info-place { display: flex; align-items: center; }
                        .bi-geo-alt-fill { margin-right: 8px; color: #7600FF}
                        .info-distance { color: gray; margin-left: 20px}
                        .info-details { margin-top: 10px; max-width: 230px; /*overflow-x: auto; white-space: nowrap;*/}
                        .info-hours { margin-top: 10px; color: gray; }
                        .info-hours span { display: block;}
                        .info-buttons { margin-top: 10px; display: flex; justify-content: space-between; }
                        .button {background-color: #7600FF; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 14px; cursor: pointer; transition: background-color 0.3s ease, transform 0.3s ease;}
                        .button:hover {background-color: #5700CC; transform: scale(1.1);}
                    </style>
                
                    <div class="info-window">
                        <div class="info-header">
                            <div class="info-place">
                                <i class="bi bi-geo-alt-fill"></i>
                                <div><strong>${placeName}</strong></div>
                            </div>
                            <div class="info-distance">${distance}m</div>
                        </div>
                
                        <div class="info-details">
                            <a href="${information? information: ""}" target="_blank">${information ? information: "No website"}</a>
                        </div>
                        
                        <div class="info-hours">
                            <strong>Opening hours:</strong><br>
                            ${openingHours !== "None" ? `
                                <span>${openingHours[0]}</span>
                                <span>${openingHours[1]}</span>
                                <span>${openingHours[2]}</span>
                                <span>${openingHours[3]}</span>
                                <span>${openingHours[4]}</span>
                                <span>${openingHours[5]}</span>
                                <span>${openingHours[6]}</span>
                            ` : "None"}
                        </div>
                        
                        <div class="info-buttons">
                            <button class="button" id="close-button">Close</button>
                            <button class="button" id="select-button">Select</button>
                        </div>
                    </div>
                </div>
                </body>
            `
}

export function getInfoWindowContentForDestination(placeName,distance) {
    return `<head>
                    <title>info-window</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css" rel="stylesheet">
                </head>
                <body>
                <div style="
                                padding: 10px;
                              ">
                    <style>
                        .gm-style-iw-chr {display: none;}
                        .info-window { padding: 10px; }
                        .info-header { display: flex; justify-content: space-between; align-items: center; }
                        .info-place { display: flex; align-items: center; }
                        .bi-geo-alt-fill { margin-right: 8px; color: #7600FF}
                        .info-distance { color: gray; margin-left: 20px}
                        .info-buttons { margin-top: 50px; display: flex; justify-content: space-between; }
                        .button {background-color: #7600FF; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 14px; cursor: pointer; transition: background-color 0.3s ease, transform 0.3s ease;}
                        .select-button { margin-left: 10px; }
                        .button:hover {background-color: #5700CC; transform: scale(1.1);}
                    </style>
                
                    <div class="info-window">
                        <div class="info-header">
                            <div class="info-place">
                                <i class="bi bi-geo-alt-fill"></i>
                                <div><strong>${placeName}</strong></div>
                            </div>
                            <div class="info-distance">${distance}m</div>
                        </div>
                      
                        <div class="info-buttons">
                            <button class="button" id="close-button">Close</button>
                            <button class="button" id="select-button">Select and finish</button>
                        </div>
                    </div>
                </div>
                </body>
            `
}