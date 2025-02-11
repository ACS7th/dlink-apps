package site.dlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ComponentScan(basePackages = {"site.dlink.alcohols", "site.dlink.common"})
public class AlcoholsApplication {

	public static void main(String[] args) {
		SpringApplication.run(AlcoholsApplication.class, args);
	}

}