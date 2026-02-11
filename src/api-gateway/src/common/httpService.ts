import { HttpException, Injectable } from '@nestjs/common';
import { HttpService as NestHttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class AppHttpService {
  constructor(private readonly httpService: NestHttpService) {}

  /** Faz GET e repassa exatamente status e body do servidor em caso de erro (proxy). */
  async getAsProxy<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res = await this.get<T>(url, config);
      return res.data;
    } catch (e) {
      const err = e as AxiosError<unknown>;
      if (err.response != null) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw e;
    }
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return firstValueFrom(this.httpService.get<T>(url, config));
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return firstValueFrom(this.httpService.post<T>(url, data, config));
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return firstValueFrom(this.httpService.put<T>(url, data, config));
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return firstValueFrom(this.httpService.patch<T>(url, data, config));
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return firstValueFrom(this.httpService.delete<T>(url, config));
  }
}
