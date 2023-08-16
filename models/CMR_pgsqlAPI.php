<?php
    if(isset($_POST['functionname']))
    {
        $paPDO = initDB();
        $paSRID = '4326';
        $paPoint = "null";
        $functionname = $_POST['functionname'];
        if (isset($_POST['Input'])) {
            $input = $_POST['Input'];
        }
        if (isset($_POST['paPoint'])) {
            $paPoint = $_POST['paPoint'];
        }
        $aResult = "null";
        if ($functionname == 'getGeoCMRToAjax')
            $aResult = getGeoCMRToAjax($paPDO, $paSRID, $paPoint);
        else if ($functionname == 'getInfoCMRToAjax')
            $aResult = getInfoCMRToAjax($paPDO, $paSRID, $paPoint);
        else if ($functionname == 'searchbydistrict')
            $aResult = searchbydistrict($paPDO, $input);
        else if ($functionname == 'searchbyward')
            $aResult = searchbyward($paPDO, $input);
        else if ($functionname == 'getinfosearchbydistrict')
            $aResult = getinfosearchbyward($paPDO, $input);
            
        
        echo $aResult;
    
        closeDB($paPDO);
    }

    function initDB()
    {
        // Kết nối CSDL
        $paPDO = new PDO('pgsql:host=localhost;dbname=HoChiMinh;port=5432', 'postgres', '2001');

        return $paPDO;
        
    }
    function query($paPDO, $paSQLStr)
    {
        try
        {
            // Khai báo exception
            $paPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Sử đụng Prepare 
            $stmt = $paPDO->prepare($paSQLStr);
            // Thực thi câu truy vấn
            $stmt->execute();
            
            // Khai báo fetch kiểu mảng kết hợp
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            
            // Lấy danh sách kết quả
            $paResult = $stmt->fetchAll();   
            return $paResult;                 
        }
        catch(PDOException $e) {
            echo "Thất bại, Lỗi: " . $e->getMessage();
            return null;
        }       
    }
    function closeDB($paPDO)
    {
        // Ngắt kết nối
        $paPDO = null;
    }

    function getResult($paPDO,$paSRID,$paPoint)
    {
        $paPoint = str_replace(',', ' ', $paPoint);
        $mySQLStr = "SELECT ST_AsGeoJson(geom) as geo from \"gadm_hcm_2\" where ST_Within('SRID=".$paSRID.";".$paPoint."'::geometry,geom)";
        $result = query($paPDO, $mySQLStr);
        
        if ($result != null)
        {
            // Lặp kết quả
            foreach ($result as $item){
                return $item['geo'];
            }
        }
        else
            return "null";
    }

    function getGeoCMRToAjax($paPDO,$paSRID,$paPoint)
    {
        $paPoint = str_replace(',', ' ', $paPoint);
        $mySQLStr = "SELECT ST_AsGeoJson(geom) as geo from \"gadm_hcm_2\" 
                        where ST_Within('SRID=".$paSRID.";".$paPoint."'::geometry,geom)";
        $result = query($paPDO, $mySQLStr);
        
        if ($result != null)
        {
            // Lặp kết quả
            foreach ($result as $item){
                return $item['geo'];
            }
        }
        else
            return "null";
    }

    function getInfoCMRToAjax($paPDO,$paSRID,$paPoint)
    {
        $paPoint = str_replace(',', ' ', $paPoint);
        $mySQLStr = "SELECT gid, dientich as shape_area ,danso,name_2,soluong from \"gadm_hcm_2\" 
                        where ST_Within('SRID=".$paSRID.";".$paPoint."'::geometry,geom)";
        $result = query($paPDO, $mySQLStr);
        
        if ($result != null)
        {
            $resFin = '<table class="table table-bordered border-primary">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Thông tin</th>
                                <th scope="col">Giá trị</th>
                                <th scope="col">Đơn vị</th>
                            </tr>
                        </thead>';
            foreach ($result as $item){
                $resFin = $resFin.'<tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>gid</td>
                        <td>'.$item['gid'].'</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Địa điểm</td>
                        <td>'.$item['name_2'].'</td>
                        <td>Quận/huyện</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Xã/Phường</td>
                        <td>'.$item['soluong'].'</td>
                        <td>Số lượng</td>
                    </tr>
                    <tr>
                        <th scope="row">4</th>
                        <td>Diện tích</td>
                        <td>'.$item['shape_area'].'</td>
                        <td>km²</td>
                    </tr>
                    <tr>
                        <th scope="row">5</th>
                        <td>Dân số</td>
                        <td>'.$item['danso'].'</td>
                        <td>người</td>
                    </tr>';
                break;
            }
            $resFin = $resFin.'</tbody>
                                </table>';
            return $resFin;
        }
        else
            return "null";
    }
    function searchbyward($paPDO,$input) // tim kiem theo xa phuong
    {
        $mySQLStr = "SELECT ST_AsGeoJson(geom) as geo from \"gadm_hcm_3\" where name_2 = '$input'";
        $result = query($paPDO, $mySQLStr);
        
        if ($result != null)
        {
            // Lặp kết quả
            foreach ($result as $item){
                return $item['geo'];
            }
        }
        else
            return "null";
    }
    function getinfosearchbyward($paPDO,$input) // tim kiem theo xa phuong
    {
        $mySQLStr = "SELECT gid, dientich as shape_area ,danso,name_2,soluong from \"gadm_hcm_2\" 
                        where name_2 = '$input'";
        $result = query($paPDO, $mySQLStr);
        
        if ($result != null)
        {
            $resFin = '<table class="table table-bordered border-primary">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Thông tin</th>
                                <th scope="col">Giá trị</th>
                                <th scope="col">Đơn vị</th>
                            </tr>
                        </thead>';
            foreach ($result as $item){
                $resFin = $resFin.'<tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>gid</td>
                        <td>'.$item['gid'].'</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Địa điểm</td>
                        <td>'.$item['name_2'].'</td>
                        <td>Quận/huyện</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Xã/Phường</td>
                        <td>'.$item['soluong'].'</td>
                        <td>Số lượng</td>
                    </tr>
                    <tr>
                        <th scope="row">4</th>
                        <td>Diện tích</td>
                        <td>'.$item['shape_area'].'</td>
                        <td>km²</td>
                    </tr>
                    <tr>
                        <th scope="row">5</th>
                        <td>Dân số</td>
                        <td>'.$item['danso'].'</td>
                        <td>người</td>
                    </tr>';
                break;
            }
            $resFin = $resFin.'</tbody>
                                </table>';
            return $resFin;
        }
        else
            return "Không tìm thấy!";
    }
    function searchbydistrict($paPDO,$input) // tim kiem theo xa phuong
    {
        $mySQLStr = "SELECT ST_AsGeoJson(geom) as geo from \"gadm_hcm_2\" 
                        where name_2 = '$input'";
        // echo $mySQLStr;
        $result = query($paPDO, $mySQLStr);
        
        if ($result != null)
        {
            // Lặp kết quả
            foreach ($result as $item){
                return $item['geo'];
            }
        }
        else
            return "null";
    }
?>