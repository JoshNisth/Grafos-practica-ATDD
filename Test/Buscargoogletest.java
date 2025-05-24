import java.util.concurrent.TimeUnit;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import static org.testng.Assert.*;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import java.util.concurrent.TimeUnit;
import io.github.bonigarcia.wdm.*;
import org.testng.Assert;

/****************************************/
// Historia de Usuario: Como usuario quiero verificar que el boton "Buscar con Google" se despliega
//
// Prueba de Aceptacion: Verificar que el boton de busqueda tenga el texto "Buscar con Google"
//
// 1. Ingresar a la pagina de Google: https://www.google.com
// 2. Buscar el boton "Buscar con Google"

// 
// Resultado Esperado: El boton "Buscar con Google" debe estar presente y ser visible
/****************************************/


//Para ejecutar en la linea de comando: mvn clean compile test -Dtest=BuscarGoogleTest

public class BuscarGoogleTest {
    
    private WebDriver driver;
    
    @BeforeTest
    public void setDriver() throws Exception{

        //https://sites.google.com/chromium.org/driver/getting-started
        
    	String path = "C:/chromedriver/chromedriver.exe";

        
        System.setProperty("webdriver.chrome.driver", path);

        
        WebDriverManager.chromedriver().setup();
        
        driver = new ChromeDriver();
        
    }
    
    @AfterTest
    public void closeDriver() throws Exception{
        driver.quit();
    }
    
    @Test
    public void paginaPrincipalGoogle(){
        
        /**************Preparacion de la prueba***********/
    	
    	//1. Ingresar a la pagina de Google
        String googleUrl = "https://www.google.com";
        driver.get(googleUrl);
        
        
        /**************Logica de la prueba***************/
        // 2. En el campo de texto, escribir un criterio de busqueda
        
        /*Capturar el campo de busqueda*/
        
        WebElement boton = driver.findElement(By.name("btnK"));

        /*Escribir el termino de busqueda*/
        
        
        //campoBusqueda.sendKeys("Universidad Catolica Boliviana");
        
        try{
            TimeUnit.SECONDS.sleep(3);
        }
        catch(InterruptedException e){
        	e.printStackTrace();
        }    
        
        //3. Presionar la tecla Enter
        //campoBusqueda.submit();
        
        
        
        
        /************Verificacion de la situacion esperada - Assert***************/
        
       // WebElement resultado = driver.findElement(By.xpath("//*[@id=\"rso\"]/div[1]/div/div/div/table/tbody/tr[1]/td/div/div/div/div/h3/a"));


        String label = boton.getAttribute("value");
        System.out.println("Texto del boton:: "+label);
        
        
        Assert.assertEquals(label,"Buscar con Google");
    }
    
   
   
    
    
    
    
    /*
     
        
       
        
        
        

        
        
        
        try{
            TimeUnit.SECONDS.sleep(7);
        }
        catch(InterruptedException e){
        	e.printStackTrace();
        }    
        
        
       

      */
    
}