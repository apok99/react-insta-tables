# react-insta-tables
Welcome to this component.

### How To Install
First of all this component needs Tailwind CSS. Please see how to install Tailwind CSS [here](https://tailwindcss.com/docs/installation "Tailwind CSS").

Please this component needs React hooks or React version ^17.

This package can be installed via NPM   
```Javascript
    npm i react-insta-tables
```

#### Example how it works.

Below is a simple code on how to use the Insta Table...
```Javascript

import './App.css';
import React from 'react';
import Table from "react-insta-tables";

function App() {
  return (
    <div className="App"> 
        <Table data={[{name:'david', surname:'victoria martinez', favoriteFastFood:'taco', date:'07-07-2021 15:00:00'}]} 
            headers={[{header: 'name', accessor:'name', type:'string'}, {header: 'surname', accessor:'surname', type:'string'}, {header: 'favorite fast food', accessor:'favoriteFastFood', type:'string'}, {header:'date', accessor:'date', type:'date', format:'DD-MM-YYYY hh:mm:ss'}]} 
            paginationNumber={10}>
        </Table>
    </div>
  );
}
export default App;

```

### Configuration.

This simple code mounts an insta table, with filters by columns, pagination, order by columns on different by date or by a string.

In the version 1.0 we have only 3 props:

    1.Data: Array with objects inside.
    2.Headers: Array who have all the configuration about the columns. We have many parts:
        2.1.header: This key will be the title of the column.
        2.2.accessor: This key will look up on the data array to get the value.
        2.3.type: This key will say what type of data is inside. We have many:
            2.3.1:
                -string: This will render as a text
                -date: This will render as a date, You need to pass the format that the date have. 
                    Like this:`{header:'date', accessor:'date', type:'date', format:'DD-MM-YYYY hh:mm:ss'}`
                -integer: This will render as a number
                -icon. This will load as a picture/icon.
    3.paginationNumber: This is the number of results do you want on each page.

The top configuration will render:
![topRender](https://i.ibb.co/D4wVjRs/Captura.png)

### License
Copyright (c) 2021 David Victoria Martinez Licensed under MIT license, see LICENSE for the full license.
