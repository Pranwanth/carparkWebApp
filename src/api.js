async function geocode() {

    var location=document.getElementById("location-input").value; // get input from user
    //var location = localStorage.getItem("input");;
    console.log(location);
    apikey="AIzaSyDDPXWT4iTaB2hL_E-NAiMROYvxEJAptfM";
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+location+"+singapore&key="+apikey;
    console.log(url);
    try {
        let res = await fetch(url);
        console.log(res);
        //return coordinates in json format
        return await res.json();

    } catch (error) {
        console.log(error);
    }
}


async function convert2XY() {
    //wait for geocode to get coordinates
    let coordinates = await geocode();//in json format testgit
    var lat = coordinates.results[0].geometry.location.lat;
    var lng = coordinates.results[0].geometry.location.lng;

    coord = {
        latitude: lat,
        longitude: lng,
      };
      text = JSON.stringify(coord);
      localStorage.setItem("search coordinates",text);



    //call api to convert geocoordinates to XYformat
    let url="https://developers.onemap.sg/commonapi/convert/4326to3414?latitude=" +lat +"&longitude=" +lng;
    try {
        let res = await fetch(url);
        console.log("test");
        //return coordinates in json format
        return await res.json();

    } catch (error) {
        console.log(error);
    }

}

async function getcarpark()
{
    let url = 'all-carpark-list.json';
    try {
        let res = await fetch(url);
        console.log(res);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
async function findnearbycarpark()
{

    hdbcarparkcentral=["ACB","BBB","BRB1","CY","DUHM","HLM","KAB","KAM","KAS","PRM","SLS","SR1","SR2","TPM","UCS","WCB"];// HDB Car Parks Within Central Area
    carParkList=await getcarpark();

   geocoordinates=await convert2XY();

   console.log('carparklist');

   nearbycarpark=[];//array to store nearbycarpark

    range=300;

   for (i = 0; i < carParkList.length; i++) {


    if(carParkList[i].x_coord==null)
    {
      coordstr=carParkList[i].coordinates;

      coord=coordstr.split(',');

      if(carParkList[i].car_park_no!=null&&carParkList[i].car_park_no!=carParkList[i-1].car_park_no)
      {
        carParkList[i].x_coord=coord[0];
        carParkList[i].y_coord=coord[1];
      }

      }




      if(carParkList[i].weekdayRate==null)
      {
        carParkList[i].weekdayRate="$0.60";
        carParkList[i].satdayRate="$0.60";
        carParkList[i].sunPHRate="$0.60";
        for(j=0;j<hdbcarparkcentral.length;j++)
        {
          if( carParkList[i].car_park_no==hdbcarparkcentral[j])
          {
            carParkList[i].weekdayRate="$1.20";
            carParkList[i].satdayRate="$1.20";
            carParkList[i].sunPHRate="$1.20";
          }
        }
    }



    x=parseFloat(carParkList[i].x_coord);
    y=parseFloat(carParkList[i].y_coord);
    if (
      geocoordinates.X > x - range &&
      geocoordinates.X < x + range
    ) {
      if (
        geocoordinates.Y > y - range &&
        geocoordinates.Y < y + range
      ) {
        nearbycarpark.push(carParkList[i]);
      }
    }
  }


  return await nearbycarpark;
}


async function getnearbycarpark() {

    nearbycarpark=await findnearbycarpark();

    for(i=0;i<nearbycarpark.length;i++)
  {
    const response = await fetch(
    "https://developers.onemap.sg/commonapi/convert/3414to4326?X=" +
    nearbycarpark[i].x_coord+
      "&Y=" +
      nearbycarpark[i].y_coord
  );
  const geocoordinates = await response.json();
  console.log(geocoordinates);
  nearbycarpark[i].x_coord= await geocoordinates.latitude;
  nearbycarpark[i].y_coord=await geocoordinates.longitude;




  }





  return await nearbycarpark;
}

async function getcarparkinfo(){


    api_url="https://api.data.gov.sg/v1/transport/carpark-availability";
    const res = await fetch(api_url);
    const data = await res.json();

    nearbycarpark=await getnearbycarpark();
    console.log(nearbycarpark);
    for(var j=0;j<nearbycarpark.length;j++)
    {
        target=nearbycarpark[j].car_park_no;
        console.log(target);
        for (i = 0; i < data.items[0].carpark_data.length; i++) {
            if (data.items[0].carpark_data[i].carpark_number == target) {

            avail=data.items[0].carpark_data[i].carpark_info[0].lots_available;
            total=data.items[0].carpark_data[i].carpark_info[0].total_lots;
            nearbycarpark[j].lots_available=avail;
            nearbycarpark[j].total_lots=total;
        }
         }
    }




    console.log("test");
    text=JSON.stringify(nearbycarpark);
    localStorage.setItem("nearbycarpark",text);
    window.location = "maps.html";
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropdownfunc() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(e) {
  if (!e.target.matches('.dropbtn')) {
  var myDropdown = document.getElementById("myDropdown");
    if (myDropdown.classList.contains('show')) {
      myDropdown.classList.remove('show');
    }
  }
}








//var locationForm = document.getElementById("location-form");
// Listen for submit

//locationForm.addEventListener("submit", getnearbycarpark,false);

//getnearbycarpark();
